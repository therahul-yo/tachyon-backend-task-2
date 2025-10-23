const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

// CRUD routes
router.post('/', auth, controller.createTask);
router.get('/', auth, controller.listTasks);
router.get('/:id', auth, controller.getTask);
router.put('/:id', auth, controller.updateTask);
router.delete('/:id', auth, controller.deleteTask);

// Complete task route
router.patch('/:id/complete', auth, controller.completeTask);

module.exports = router;