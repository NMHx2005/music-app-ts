import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";

import { systemConfig } from "../../config/system";


// [GET] /admin/dashboard
export const index = async (req: Request, res: Response) => {
    const songs = await Song.find({
        deleted: false
    });


    res.render("admin/pages/songs/index", {
        pageTitle: "Trang quản lý chủ để bài hát",
        songs: songs
    });
};


// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
    // Lấy ra chủ đề bài hát
    const topics = await Topic.find({
        deleted: false
    }).select("title")

    // Lấy ra tên ca sĩ
    const singer = await Singer.find({
        deleted: false
    }).select("fullName")

    res.render("admin/pages/songs/create", {
        pageTitle: "Thêm mới bài hát",
        topics: topics,
        singers: singer
    });
};


// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
    if(req.body.avatar) {
        req.body.avatar = req.body.avatar[0];
    }
    if(req.body.audio) {
        req.body.audio = req.body.audio[0];
    }


    const song = new Song(req.body);
    await song.save();
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
}