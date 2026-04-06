import User from '../models/User.js';
import Task from '../models/Task.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Admin get users error:', err.message);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      tasks,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('Admin get tasks error:', err.message);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
};

export const updateTaskByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const { status } = req.body;
    if (status !== undefined) {
      task.status = status;
    }

    await task.save();

    const updatedTask = await Task.findById(task._id).populate('user', 'name email role');
    res.json(updatedTask);
  } catch (err) {
    console.error('Admin update task error:', err.message);
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

