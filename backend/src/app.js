import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";


const app=express();
 console.log("CORS ORIGIN =", process.env.CORS_ORIGIN);
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }

))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static("public"))
app.use(cookieParser())




import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import tweetRouter from "./routes/tweets.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likesRouter from "./routes/likes.routes.js"
import commentRouter from "./routes/comments.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
app.use('/api/v2/users',userRouter)
app.use('/api/v2/videos',videoRouter)
app.use('/api/v2/playlist',playlistRouter)
app.use('/api/v2/tweets',tweetRouter)
app.use('/api/v2/subscription',subscriptionRouter)
app.use('/api/v2/likes',likesRouter)
app.use('/api/v2/comments',commentRouter)
app.use('/api/v2/dashboard',dashboardRouter)
app.use('/api/v2/healthcheck',healthcheckRouter)

export default app;