import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"

import {
  getChannelStats, 
    getChannelVideos
} from "../controllers/dashboard.controller.js"



const router=Router()

router.route('/stats/channel/:channelId').get(verifyJWT,getChannelStats)
router.route('/stats/channel/videos/:channelId').get(verifyJWT,getChannelVideos)








export default router