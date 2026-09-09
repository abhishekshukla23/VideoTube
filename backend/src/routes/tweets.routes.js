
import {
    createTweet,
       getUserTweets,
       updateTweet,
       deleteTweet
    
} from "../controllers/tweets.controller.js"
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route('/create').post(verifyJWT,createTweet)

router.route('/getTweets').get(verifyJWT,getUserTweets)

router.route('/update/:tweetId').patch(verifyJWT,updateTweet)

router.route('/deleteTweet/:tweetId').delete(verifyJWT,deleteTweet)






export default router