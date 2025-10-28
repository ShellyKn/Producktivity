import express from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/Follow.controller.js'

const router = express.Router();

// POST /api/follow
router.post('/follow', followUser);

// DELETE /api/follow
router.delete('/follow', unfollowUser);

// GET /api/users/:userId/followers
router.get('/users/:userId/followers', getFollowers);

// GET /api/users/:userId/following
router.get('/users/:userId/following', getFollowing);

export default router;