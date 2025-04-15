const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');

const generateToken = (id,name,role) => {
  return jwt.sign({ id,name,role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const Model = role === 'student' ? Student : Teacher;
    const existingUser = await Model.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User exists' });

    const newUser = await Model.create({ name:name, email:email, password:password });
    
    const token = generateToken(newUser._id,newUser.name, role);
    res.json({ token, newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const Model = role === 'student' ? Student : Teacher;
    const user = await Model.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id,user.name, role);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
