const db = require('../models');
const Task = db.Task;

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.listTasks = async (req, res) => {
  try {
    const { page=1, limit=10, status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    const offset = (page-1)*limit;
    const tasks = await Task.findAll({ 
      where, 
      limit: parseInt(limit), 
      offset: parseInt(offset), 
      order: [['createdAt','DESC']]
    });
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!task) return res.status(404).json({ error: 'Not found' });
    return res.json(task);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!task) return res.status(404).json({ error: 'Not found' });
    await task.update(req.body);
    return res.json(task);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!task) return res.status(404).json({ error: 'Not found' });
    await task.destroy();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ✅ New function to mark task as completed
exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = 'done';
    await task.save();

    return res.json(task);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};