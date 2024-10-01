import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import { connectDatabase } from "./config/database";
import { routeClient } from "./routes/client/index.route";

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

routeClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
