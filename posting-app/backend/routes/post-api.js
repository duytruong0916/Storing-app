const express = require('express');
const router = express.Router()
const PostController = require('../controllers/post')
const checkAuth = require('../middlewares/check_auth.js')
const extractFile =require('../middlewares/file.js')
/* Routes */
router.get('/post', checkAuth, PostController.GetPost);
router.get('/post:id',checkAuth, PostController.GetPostWithID);
router.post('/post',checkAuth,extractFile, PostController.AddPost)
router.delete('/post/delete:id',checkAuth, PostController.DeletePost)
router.put('/post/update:id',checkAuth,extractFile,PostController.UpdatePost)
module.exports = router;
