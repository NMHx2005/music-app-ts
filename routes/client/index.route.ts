import { Express } from "express";
import { topicRoute } from "./topic.route";
import { songRoute } from "./song.route";
import { searchRoutes } from "./search.route";


export const routeClient = (app: Express) => {
    app.use("/topics", topicRoute);

    app.use("/songs", songRoute);

    app.use("/search", searchRoutes);
}
