const express = require('express');
const controlles = require('../controllers/news.js');
const router = express.Router();
const authRouter = require('../middlewares/auth');
const { getNews, postNews, deleteNews, getNewsByOwner, deleteNewsById, likePost } = controlles;

router.get('/posts', getNews);
router.post('/posts/:owner/:description', postNews);
router.delete('/posts', deleteNews);
router.delete('/posts/:id', authRouter, deleteNewsById);
router.get('/posts/:id', getNewsByOwner);
router.patch('/posts/:id/likes', authRouter, likePost);



module.exports = router;