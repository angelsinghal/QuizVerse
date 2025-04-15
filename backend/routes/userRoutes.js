const express = require('express');
const router = express.Router();
const { getStudentResults } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

//get all results of a student
router.get('/student/:email', protect, getStudentResults);

const Student = require('../models/Student');

router.get('/student/:id',async (req,res)=>
{
    const currUser=await Student.findById(req.params.id);

    if(!currUser)
      {
        return res.status(404).json({error:"user not found"});
      }

    return res.status(200).json(currUser);
});
// Update student's score after attempting a quiz
router.put('/:studentId/quiz/:quizId',protect,async (req, res) => {
  const { studentId, quizId } = req.params;
  const { score } = req.body;

  try {
    // Ensure the logged-in user is the same as the student in the request
    if (req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'You can only update your own score' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if the quiz entry already exists, otherwise add it
    const quizIndex = student.quizzes.findIndex(q => q.quiz.toString() === quizId);
    if (quizIndex === -1) {
      student.quizzes.push({ quiz: quizId, score });
    } else {
      student.quizzes[quizIndex].score = score;
    }

    // Save the updated student data
    await student.save();
    res.json({ message: 'Score updated successfully', score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all quizzes that a student has attempted (optional for student dashboard)
router.get('/:studentId/quizzes', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('quizzes.quiz');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student.quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



