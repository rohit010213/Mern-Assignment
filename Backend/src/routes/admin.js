import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getAllUsers, getAllTasks, updateTaskByAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.get('/tasks', getAllTasks);
router.put('/tasks/:id', updateTaskByAdmin);

export default router;
