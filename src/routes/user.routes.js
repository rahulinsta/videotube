import { Router } from "express";
import { reginsterUser, loginUser, logOutUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avtar",
            maxcount: 1
        },
        {
            name: "coverimage",
            maxcount: 1
        }
    ]),
    reginsterUser
    )

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT, logOutUser)

export default router