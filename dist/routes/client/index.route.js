"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeClient = void 0;
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const search_route_1 = require("./search.route");
const routeClient = (app) => {
    app.use("/topics", topic_route_1.topicRoute);
    app.use("/songs", song_route_1.songRoute);
    app.use("/search", search_route_1.searchRoutes);
};
exports.routeClient = routeClient;
