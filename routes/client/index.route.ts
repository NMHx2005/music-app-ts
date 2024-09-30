import { Express } from "express";
import { topicRoute } from "./topic.route";


export const routeClient = (app: Express) => {
    app.use("/topics", topicRoute);
}
