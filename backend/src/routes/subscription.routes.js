import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router()

router.route('/s/:channelId').post(verifyJWT,toggleSubscription)

router.route('/c/:channelId').get(verifyJWT,getUserChannelSubscribers)

router.route('/s/:subscriberId').get(verifyJWT,getSubscribedChannels)











export default router