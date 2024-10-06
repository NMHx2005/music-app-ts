// APlayer
const aplayer = document.getElementById('aplayer');
if(aplayer) {
    let dataSong = aplayer.getAttribute("data-song");
    dataSong = JSON.parse(dataSong);

    let dataSinger = aplayer.getAttribute("data-singer");
    dataSinger = JSON.parse(dataSinger);

    const ap = new APlayer({
        container: aplayer,
        lrcType: 1,
        audio: [
            {
                name: dataSong.title,
                artist: dataSinger.fullName,
                url: dataSong.audio,
                cover: dataSong.avatar,
                lrc: dataSong.lyrics
            }
        ],
        autoplay: true
    });

    const avatar = document.querySelector(".singer-detail .inner-avatar");
    const avatar2 = document.querySelector(".aplayer .aplayer-pic");

    ap.on('play', function () {
        avatar.style.animationPlayState = "running";
        avatar2.style.animationPlayState = "running";
    });

    ap.on('pause', function () {
        avatar.style.animationPlayState = "paused";
        avatar2.style.animationPlayState = "paused";
    });

    ap.on('ended', function () {
      fetch(`/songs/listen/${dataSong._id}`, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == 200) {
            const innerListen = document.querySelector(".singer-detail .inner-actions .inner-listen .inner-number");
            innerListen.innerHTML = data.listen;
          }
        })
    });
}
// End APlayer


// Like
const buttonLike = document.querySelector("[button-like]");
if(buttonLike) {
    buttonLike.addEventListener("click", () => {
        // Lấy ra id của bài hát cần được like
        const id = buttonLike.getAttribute("button-like");

        // tạo ra data để gửi qua phía backend 
        const data = {
            id: id
        };

        // Check xem nút buttonLike đã có class active hay chưa, nếu chưa thì thêm và nếu có thì bỏ
        // Đồng thời thêm kiểu dữ liệu cần gửi lên là like hay dislike
        if(buttonLike.classList.contains("active")) {
            buttonLike.classList.remove("active");
            data.type = "dislike";
        } else {
            buttonLike.classList.add("active");
            data.type = "like";
        }

        // Dùng hàm fetch để gửi data lên cho phía Backend
        fetch("/songs/like", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                // Nếu code được gửi về là 200 và đúng thì nó sẽ chạy vào đây.
                if(data.code == 200) {
                    // Lấy ra số lượt like hiện tại và cập nhật lại sau khi click hoặc hủy bỏ
                    const innerNumber = buttonLike.querySelector(".inner-number");
                    innerNumber.innerHTML = data.updateLike;
                }
            })
    });
}
// End Like

// Favorite
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if(listButtonFavorite) {
  listButtonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const id = buttonFavorite.getAttribute("button-favorite");
      
      fetch("/songs/favorite", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id
        })
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == 200) {
            if(data.status == "add") {
              buttonFavorite.classList.add("active");
            } else {
              buttonFavorite.classList.remove("active");
            }
          }
        })
    })
  })
}
// End Favorite


// Search Suggest 
const boxSearch = document.querySelector(".box-search");
if(boxSearch) {
  // Lấy ra giá trị cần tìm kiếm
  const input = boxSearch.querySelector("input[name='keyword']");
  
  // Khi mỗi lần keyup vào bàn phím thì nó sẽ chạy vào đây
  input.addEventListener("keyup", () => {
    // Lấy ra giá trị cần tìm kiếm của ô input
    const keyword = input.value;

    // Lấy giá trị từ APi cần được gọi
    fetch(`/search/suggest?keyword=${keyword}`)
      .then(res => res.json())
      .then(data => {
        if(data.code == 200) {
          const songs = data.songs;
          const innerSuggest = boxSearch.querySelector(".inner-suggest");
          const innerList = boxSearch.querySelector(".inner-list");

          if(songs.length > 0) {
            const htmlArray = songs.map(item => `
              <a class="inner-item" href="/songs/detail/${item.slug}">
                <div class="inner-image">
                  <img src="${item.avatar}">
                </div>
                <div class="inner-info">
                  <div class="inner-title">${item.title}</div>
                  <div class="inner-singer">
                    <i class="fa-solid fa-microphone-lines"></i> ${item.singer.fullName}
                  </div>
                  </div>
              </a>  
            `)
            innerList.innerHTML = htmlArray.join("");
            innerSuggest.classList.add("show");
          } else {
            innerList.innerHTML = "";
            innerSuggest.classList.remove("show");
          }
        }
      })
  });
}
// End Search Suggest 