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
    upload.fields([
        {
          name: "avatar",
          maxCount: 1
        },
        {
          name: "audio",
          maxCount: 1
        }
    ]),
    uploadCoud.uploadFields,
    controller.createPost
);

router.get("/edit/:id", controller.edit);


router.patch(
  "/edit/:id",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "audio",
      maxCount: 1
    }
  ]),
  uploadCoud.uploadFields,
  controller.editPatch
);


export const songRoute: Router = router;