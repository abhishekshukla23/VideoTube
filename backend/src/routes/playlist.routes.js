
import {
    createPlaylist,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistById
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";


const router=Router();

router.route('/create').post(verifyJWT,createPlaylist)
router.route('/getPlaylist').get(verifyJWT,getUserPlaylists)

router.route('/add/:playlistId/:videoId').patch(verifyJWT,addVideoToPlaylist)
router.route('/remove/:playlistId/:videoId').patch(verifyJWT,removeVideoFromPlaylist)
router.route('/delete/:playlistId').delete(verifyJWT,deletePlaylist)
router.route('/update/:playlistId').patch(verifyJWT,updatePlaylist)
router.route('/getPlaylistById/:playlistId').get(verifyJWT,getPlaylistById)

export default router;