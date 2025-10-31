import express from 'express';
import { createTask, getTasksByUser, getTaskById, updateTask, deleteTask, getTaskStats } from '../controllers/Task.controller.js';

const router = express.Router();

// GET /api/tasks/user/:ownerId/stats
router.get('/user/:ownerId/stats', getTaskStats);

//GET - /api/tasks/user/:ownerId
router.get('/user/:ownerId', getTasksByUser);

// GET - /api/tasks/:taskId
router.get('/:taskId', getTaskById);

// POST - /api/tasks
router.post('/', createTask);

// PATCH  - /api/tasks/:taskId
router.patch('/:taskId', updateTask);

// DELETE /api/tasks/:taskId
router.delete('/:taskId', deleteTask);

export default router;