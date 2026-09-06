import { Router } from "express";
import { registerUser,userLogin,userLogout,refreshAccessToken,changePassword,getCurrentUser,updateAccountDetails,updateAvatar,updateCoverImage,getUserChannelProfile,getUserWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router()

router.route('/register').post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
 
]),registerUser



)

router.route('/login').post(userLogin)

router.route('/logout').post(verifyJWT,userLogout)

router.route('/refresh-token').post(refreshAccessToken)

router.route('/change-password').post(verifyJWT
    ,changePassword)

router.route('/get-user').get(verifyJWT,getCurrentUser)
router.route('/update-details').patch(verifyJWT,updateAccountDetails)

router.route('/update-avatar').patch(verifyJWT,upload.single("avatar"),updateAvatar)

router.route('/update-coverImage').patch(verifyJWT,upload.single("coverImage"),updateCoverImage)

router.route('/c/:username').get(verifyJWT,getUserChannelProfile)

router.route('/history').get(verifyJWT,getUserWatchHistory)

export default router