
import {
    createPlaylist,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";


const router=Router();

router.route('/').post(verifyJWT,createPlaylist)
router.route('/getPlaylist').get(verifyJWT,getUserPlaylists)

router.route('/add/:videoId/:playlistId').patch(verifyJWT,addVideoToPlaylist)
router.route('/remove/:videoId/:playlistId').patch(verifyJWT,removeVideoFromPlaylist)
router.route('/delete/:playlistId').delete(verifyJWT,deletePlaylist)
router.route('/update/:playlistId').patch(verifyJWT,updatePlaylist)


export default router;