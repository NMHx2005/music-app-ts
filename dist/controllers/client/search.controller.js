"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const unidecode_1 = __importDefault(require("unidecode"));
const result = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = `${req.query.keyword}`;
    const type = req.params.type;
    const unidecodeText = (0, unidecode_1.default)(keyword);
    const keywordSlug = unidecodeText.replace(/\s+/g, "-");
    const keyWordSlugRegex = new RegExp(keywordSlug, "i");
    const keyWordRegex = new RegExp(keyword, "i");
    const songsDetail = [];
    if (keyword) {
        const songs = yield song_model_1.default.find({
            $or: [
                { slug: keyWordSlugRegex },
                { title: keyWordRegex }
            ],
            deleted: false,
            status: "active"
        }).select("avatar title singerId like slug");
        for (const item of songs) {
            const singer = yield singer_model_1.default.findOne({
                _id: item.singerId,
                deleted: false
            }).select("fullName");
            songsDetail.push({
                id: item.id,
                avatar: item.avatar,
                title: item.title,
                like: item.like,
                slug: item.slug,
                singer: {
                    fullName: singer.fullName
                },
            });
        }
    }
    if (type == "result") {
        res.render("client/pages/search/result", {
            pageTitle: `Kết quả: ${keyword}`,
            keyword: keyword,
            songs: songsDetail
        });
    }
    else {
        res.json({
            code: 200,
            songs: songsDetail
        });
    }
});
exports.result = result;
