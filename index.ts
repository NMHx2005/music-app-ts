import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import { connectDatabase } from "./config/database";
import { routeClient } from "./routes/client/index.route";
import { routesAdmin } from "./routes/admin/index.route";
import { systemConfig } from "./config/system";
import path from "path";

connectDatabase();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));


app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.locals.prefixAdmin = systemConfig.prefixAdmin;
routesAdmin(app);

routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
