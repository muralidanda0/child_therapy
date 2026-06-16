const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');
const { isAuthenticated, isTherapist } = require('../middleware/authMiddleware');

router.get('/dashboard', isAuthenticated, isTherapist, therapistController.getDashboard);
router.get('/sessions', isAuthenticated, isTherapist, therapistController.getSessions);
router.put('/availability', isAuthenticated, isTherapist, therapistController.updateAvailability);
router.post('/messages/send', isAuthenticated, isTherapist, therapistController.sendMessage);
router.post('/settings', isAuthenticated, isTherapist, therapistController.updateSettings);

module.exports = router;
