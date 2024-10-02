// APlayer
const aplayer = document.getElementById('aplayer');
if(aplayer) {
    let dataSong = aplayer.getAttribute("data-song");
    dataSong = JSON.parse(dataSong);

    let dataSinger = aplayer.getAttribute("data-singer");
    dataSinger = JSON.parse(dataSinger);

    const ap = new APlayer({
        container: aplayer,
        audio: [
            {
                name: dataSong.title,
                artist: dataSinger.fullName,
                url: dataSong.audio,
                cover: dataSong.avatar
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


