import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";


// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const slugTopic: string = req.params.slugTopic;
  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active"
  });
  const songs = await Song.find({
    topicId: topic.id,
    deleted: false,
    status: "active"
  }).select("title avatar singerId like slug");
  for (const item of songs) {
    const singerInfo = await Singer.findOne({
      _id: item.singerId
    }).select("fullName");
    item["singerFullName"] = singerInfo["fullName"];
  }
  res.render("client/pages/songs/list", {
    pageTitle: topic.title,
    songs: songs
  });
};



// [GET] /songs/detail/:slugTopic
export const detail = async (req: Request, res: Response) => {
  const slugSong: string = req.params.slugSong;
  
  const song = await Song.findOne({
    slug: slugSong,
    deleted: false,
    status: "active"
  })

  const singer = await Singer.findOne({
    _id: song.singerId
  }).select("fullName");

  const topic = await Topic.findOne({
    _id: song.topicId
  }).select("title");

  const existSongInFavorite = await FavoriteSong.findOne({
    // userId: res.locals.user.id,
    songId: song.id
  });
  if(existSongInFavorite) {
    song["isFavorite"] = true;
  }

  res.render("client/pages/songs/detail", {
    song: song,
    singer: singer,
    topic: topic,
    pageTitle: "Chi tiết bài hát"
  });
};



// [PATCH] /songs/like
export const like = async (req: Request, res: Response) => {
  const { id, type } = req.body;

  const song = await Song.findOne({
    _id: id,
    deleted: false,
    status: "active"
  });

  let updateLike = song.like;

  if(type == "like") {
    updateLike++;
  } else {
    updateLike--;
  }

  await Song.updateOne({
    _id: id,
    status: "active",
    deleted: false
  }, {
    like: updateLike
  })
  res.json({
    code: 200,
    updateLike: updateLike,
    message: "Cập nhật thành công"
  })
}


// [PATCH] /songs/favoritePatch
export const favoritePatch = async (req: Request, res: Response) => {
  const { id } = req.body;
  const data = {
    // userId: res.locals.user.id,
    songId: id
  };
  const existSongInFavorite = await FavoriteSong.findOne(data);
  let status = "";
  if(existSongInFavorite) {
    await FavoriteSong.deleteOne(data);
  } else {
    const record = new FavoriteSong(data);
    await record.save();
    status = "add";
  }
  res.json({
    code: 200,
    status: status
  });
};


// [GET] /songs/favorite
export const favorite = async (req: Request, res: Response) => {
  const songs = await FavoriteSong.find({
    // userId: res.locals.user.id
  });

  for (const song of songs) {
    // Lấy ra id của ca sĩ và tên của bài hát cùng với 1 số thuộc tính cần thiết
    const infoSong = await Song.findOne({
      _id: song.songId
    }).select("title avatar singerId slug");

    const infoSinger = await Singer.findOne({
      _id: infoSong.singerId
    }).select("fullName");

    song["infoSong"] = infoSong;
    song["infoSinger"] = infoSinger;
  }
  res.render("client/pages/songs/favorite", {
    pageTitle: "Bài hát yêu thích",
    songs: songs
  });
}

// [PATCH] /listen/:songId
export const listenPatch = async (req: Request, res: Response) => {
  const songId = req.params.songId;
  const song = await Song.findOne({
    _id: songId,
    status: "active",
    deleted: false
  });
  const listenUpdate = song.listen + 1;
  await Song.updateOne({
    _id: songId,
    status: "active",
    deleted: false
  }, {
    listen: listenUpdate
  });
  res.json({
    code: 200,
    message: "Đã cập nhật số lượt nghe!",
    listen: listenUpdate
  });
};