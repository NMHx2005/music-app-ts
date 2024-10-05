import { Router } from "express";
import * as uploadCoud from "../../middlewares/admin/uploadCloud.middleware";
import multer from "multer";


const upload = multer();


const router: Router = Router();

import * as controller from "../../controllers/admin/song.controller";

router.get("/", controller.index);

router.get("/create", controller.create);


router.post(
    "/create",
    upload.single("avatar"),
    uploadCoud.uploadSingle,
    controller.createPost
);

export const songRoute: Router = router;