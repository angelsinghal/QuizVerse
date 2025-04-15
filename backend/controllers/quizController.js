const Quiz = require('../models/Quiz');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

exports.createQuiz = async (req, res) => {
  const { name, password, questions } = req.body;
  try {
    const quiz = await Quiz.create({
      name, password, questions,
      createdBy: req.user._id
    });

    const teacher = await Teacher.findById(req.user._id);
    teacher.quizzes.push(quiz._id);
    await teacher.save();

    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLiveQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ live: true }).populate('createdBy', 'name');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  const { quizId, answers, password } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz.password !== password)
      return res.status(401).json({ message: 'Incorrect password' });

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.correctAnswer === answers[idx]) score++;
    });

    const student = await Student.findById(req.user._id);
    student.quizzes.push({ quizId, score });
    await student.save();

    res.json({ score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
