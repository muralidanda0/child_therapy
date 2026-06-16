const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapistController');
const { isAuthenticated, isTherapist } = require('../middleware/authMiddleware');

router.post('/:id/notes', isAuthenticated, isTherapist, therapistController.saveSessionNote);

module.exports = router;
