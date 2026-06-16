const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { isAuthenticated, isParent } = require('../middleware/authMiddleware');

router.get('/dashboard', isAuthenticated, isParent, parentController.getDashboard);
router.post('/children/add', isAuthenticated, isParent, parentController.addChild);
router.post('/messages/send', isAuthenticated, isParent, parentController.sendMessage);
router.post('/settings', isAuthenticated, isParent, parentController.updateSettings);

module.exports = router;
