const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { auth, isStudent, isInstructor, isAdmin } = require('../middleware/auth');

// Instructor routes - Create and manage assignments
router.post('/', auth, isInstructor, assignmentController.createAssignment);
router.get('/course/:courseId', auth, assignmentController.getCourseAssignments);
router.get('/:assignmentId/submissions', auth, isInstructor, assignmentController.getSubmissions);

// Student routes - Submit assignments
router.post('/submit', auth, isStudent, assignmentController.submitAssignment);

// Grading route - Instructor only
router.put('/grade', auth, isInstructor, assignmentController.gradeSubmission);

module.exports = router;