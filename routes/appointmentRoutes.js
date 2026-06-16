const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { isAuthenticated, isParent } = require('../middleware/authMiddleware');

router.get('/new', isAuthenticated, isParent, appointmentController.getBooking);
router.post('/new', isAuthenticated, isParent, appointmentController.postNewAppointment);
router.post('/:id/cancel', isAuthenticated, isParent, appointmentController.cancelAppointment);

module.exports = router;
