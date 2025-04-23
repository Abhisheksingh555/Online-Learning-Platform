const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { auth, isStudent, isInstructor } = require('../middleware/auth');

router.use(auth);

router.post('/create', isInstructor, assignmentController.createAssignment);
router.get('/getAllAssignments', assignmentController.getAllAssignments);
router.get('/getAssignmentDetails/:id', assignmentController.getAssignment);
router.put('/update/:id', isInstructor, assignmentController.updateAssignment);
router.delete('/delete/:id', isInstructor, assignmentController.deleteAssignment);
router.post('/submit/:assignmentId', isStudent, assignmentController.submitAssignment);
router.put('/grade/:assignmentId/:submissionId', isInstructor, assignmentController.gradeSubmission);
router.get('/getSubmissions/:assignmentId', isInstructor, assignmentController.getSubmissions);
router.get('/getStudentAssignments', isStudent, assignmentController.getStudentAssignments);
router.get('/getInstructorAssignments', isInstructor, assignmentController.getInstructorAssignments);

module.exports = router;