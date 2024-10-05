import { Express } from "express";
import { dashboardRoute } from "./dashboard.route";
import { systemConfig } from "../../config/system";


export const routesAdmin = (app: Express) => {
    const PATCH = `${systemConfig.prefixAdmin}`;

    app.use(`/${PATCH}/dashboard`, dashboardRoute);
}
