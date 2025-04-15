const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Quiz = require('../models/Quiz');
const router = express.Router();

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to handle PDF upload and parsing
router.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const filePath = req.file.path;
  try {
    // Read the PDF file
    const data = await pdfParse(fs.readFileSync(filePath));
    const text = data.text;

    // Process the text and extract quiz questions, options, and answers
    const quiz = processPdfToQuiz(text); // You need to implement this function

    // Save the extracted quiz to the database
    const newQuiz = new Quiz({
      name: quiz.name,
      password: quiz.password,
      questions: quiz.questions,
      live: true,
      createdBy: req.user._id, // Assuming req.user is populated after authentication
    });

    await newQuiz.save();
    res.status(200).send('Quiz created successfully from PDF');
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).send('Error processing the PDF');
  }
});

// Function to process the PDF text and convert it into a quiz structure
function processPdfToQuiz(text) {
  // Implement your logic to extract quiz data from PDF text
  // For now, I'm returning a mock example

  const quiz = {
    name: 'Sample Quiz from PDF',
    password: 'quizpassword123',
    questions: [
      {
        question: 'What is 2 + 2?',
        options: ['3', '4', '5'],
        correctAnswer: '4',
      },
      {
        question: 'What is the capital of France?',
        options: ['Berlin', 'Madrid', 'Paris'],
        correctAnswer: 'Paris',
      },
    ],
  };

  return quiz;
}

module.exports = router;
