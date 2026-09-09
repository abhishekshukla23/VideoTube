import { Router } from "express";
import { getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    removeFromWatchHistory

} from "../controllers/video.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"


const router=Router();



router.route('/').get(getAllVideos)

router.route('/publish').post(verifyJWT,upload.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    {
        name:"thumbnail",
        maxCount:1
    },
]),
publishAVideo
)


router.route('/:videoId').get(verifyJWT,getVideoById)
router.route('/updateVideo/:videoId').patch(verifyJWT,
    upload.single("thumbnail"),updateVideo
)

router.route('/deleteVideo/:videoId').delete(verifyJWT,deleteVideo)

router.route('/togglePublish/:videoId').patch(verifyJWT,togglePublishStatus)

router.route('/removeFromHistory/:videoId').delete(verifyJWT,removeFromWatchHistory)










export default router