import { taskModel } from '../models/Task.model.js';

export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    
    if (!taskData.ownerId || !taskData.title) {
      return res.status(400).json({ error: "ownerId and title are required!" });
    }

    const task = await taskModel.create(taskData);
    res.status(201).json({ message: "Task created successfully: ", task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasksByUser = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { status, priority, labels, sort, limit } = req.query;
    
    const options = {};
    if (status) options.status = status;
    if (priority) options.priority = parseInt(priority);
    if (labels) options.labels = labels.split(',');
    if (sort) options.sort = JSON.parse(sort);
    if (limit) options.limit = parseInt(limit);

    const tasks = await taskModel.findByOwner(ownerId, options);
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await taskModel.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: "Task not found!" });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;
    
    const result = await taskModel.update(taskId, updateData);
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Task not found!" });
    }

    res.json({ message: "Task updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await taskModel.delete(taskId);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found!" });
    }

    res.json({ message: "Task deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const stats = await taskModel.getStats(ownerId);
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};