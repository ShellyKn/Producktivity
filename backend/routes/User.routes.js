import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserStreak, searchUsers } from '../controllers/User.controller.js';

const router = express.Router();

// POST - /api/users/register
router.post('/register', registerUser);

// POST - /api/users/login
router.post('/login', loginUser);

// GET - /api/users/search
router.get('/search', searchUsers);

// GET - /api/users/:userId
router.get('/:userId', getUserProfile);

// PATCH - /api/users/:userId/streak
router.patch('/:userId/streak', updateUserStreak);

export default router;
