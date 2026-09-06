
import { Router } from "express"


import { toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router=Router()
router.route('/toggle/t/:tweetId').post(verifyJWT,toggleTweetLike)
router.route('/toggle/v/:videoId').post(verifyJWT,toggleVideoLike)
router.route('/toggle/l/:likeId').post(verifyJWT,toggleCommentLike)

router.route('/likedVideos').get(verifyJWT,getLikedVideos)








export default router;