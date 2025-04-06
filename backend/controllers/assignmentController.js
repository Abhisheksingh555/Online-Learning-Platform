const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, course, dueDate, maxPoints, attachments } = req.body;
    
    const assignment = new Assignment({
      title,
      description,
      course,
      instructor: req.user.id,
      dueDate,
      maxPoints,
      attachments
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignments for a course
exports.getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('instructor', 'name email');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionText, attachments } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const submission = new Submission({
      assignment: assignmentId,
      student: req.user.id,
      submissionText,
      attachments,
      status: new Date() > assignment.dueDate ? 'late' : 'submitted'
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Grade submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId, grade, feedback } = req.body;
    
    const submission = await Submission.findById(submissionId)
      .populate('assignment', 'maxPoints');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (grade > submission.assignment.maxPoints) {
      return res.status(400).json({ message: 'Grade cannot exceed max points' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date();
    submission.status = 'graded';

    await submission.save();
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get submissions for an assignment
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};