const Student = require('../models/Student');

exports.getStudentResults = async (req, res) => {
  const { email } = req.params;
  try {
    const student = await Student.findOne({ email }).populate('quizzes.quizId', 'name');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student.quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
