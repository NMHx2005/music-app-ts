import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";


// [GET] /search/result
export const result = async (req: Request, res: Response) => {
    // Lấy ra keyword
    const keyword = `${req.query.keyword}`;

    // Tạo đoạn mã regex để tìm kiếm
    const keywordRegex = new RegExp(keyword, "i");

    // Lấy ra các bài hát tìm được
    const songs = await Song.find({
        title: keywordRegex,
        deleted: false,
        status: "active"
    }).select("avatar title singerId like slug");

    // Thêm tên của các ca sĩ cho từng bài hát
    for (const item of songs) {
        // Lấy ra tên của từng bài hát
        const singer = await Singer.findOne({
            _id: item.singerId,
            deleted: false
        }).select("fullName");
   
        // Thêm tên vào songs
        item["singer"] = singer;
    }

    // Trả dữ liểu ra giao diện
    res.render("client/pages/search/result", {
        pageTitle: `Kết quả tìm kiếm: ${keyword}`,
        keyword: keyword,
        songs: songs
    })
};