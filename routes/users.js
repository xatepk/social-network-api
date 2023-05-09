const express = require('express');
const controlles = require('../controllers/users');
const router = express.Router();
const { createUser, getUsers, login,
      uploadAvatar, getUser, uploadInfo,
      addFriend, getUserFriends, deleteUserById, getUserById } = controlles;
const authRouter = require('../middlewares/auth');


router.post('/signup', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.get('/user', authRouter, getUser);
router.patch('/users/me', authRouter, uploadInfo);
router.post('/signin', login);
router.patch('/users/avatar', authRouter, uploadAvatar);
router.get('/users/friends', authRouter, getUserFriends);
router.delete('/users/:id', deleteUserById);
router.patch('/users/:id/friends', authRouter, addFriend);

module.exports = router;