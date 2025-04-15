const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Set req.user and req.role based on the decoded token
    if (decoded.role === 'student') {
      req.user = await Student.findById(decoded.id);
      req.role = 'student';
    } else if (decoded.role === 'teacher') {
      req.user = await Teacher.findById(decoded.id);
      req.role = 'teacher';
    } else {
      return res.status(401).json({ message: 'Invalid role in token' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { protect };

