const express = require('express');
const router = express.Router();
const { createQuiz, getLiveQuizzes, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');



const upload = require('./multerConfig');

//get all quizes by a teacher
// GET /api/quiz
router.get('/', protect, async (req, res) => {
    try {
      const quizzes = await Quiz.find({ createdBy: req.user.id }).populate('createdBy', 'name');
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST /api/quiz/upload-pdf
  router.post('/upload-pdf',protect, upload.single('pdf'), async (req, res) => {
    try {
      // Check if file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
  
      // You can now use req.file to access the uploaded file
      console.log(req.file); // Log file details for debugging
  
      // Optionally, you can save the file's metadata into the database
      // Example: Save quiz with file path in the database
      const quiz = new Quiz({
        name: req.body.name, // For example, from form data
        filePath: req.file.path // Store the file's path
      });
      
      await quiz.save(); // Save quiz to the database
      
      res.status(201).json({ message: 'Quiz created successfully with PDF!' });
    } catch (error) {
      console.error('Error in file upload:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // PATCH /api/quiz/:id/toggle
router.patch('/:id/toggle', protect, async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
  
      if (!quiz || quiz.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized or quiz not found' });
      }
  
      quiz.live = !quiz.live;
      await quiz.save();
  
      res.json({ message: 'Quiz status updated', quiz });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  
  // DELETE /api/quiz/:id
router.delete('/:id', protect, async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
  
      if (!quiz || quiz.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized or quiz not found' });
      }
  
      await quiz.deleteOne();
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete quiz' });
    }
  });
  

router.post('/create', protect, createQuiz);
router.get('/live', protect, getLiveQuizzes);
router.post('/submit', protect, submitQuiz);

router.get('/:id', async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id).populate('createdBy', 'name email');
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.json(quiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;
