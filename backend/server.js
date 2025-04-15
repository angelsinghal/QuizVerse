const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);

// DB Connection
mongoose.connect('mongodb://127.0.0.1:27017/quizapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  })
  .then(() => {
  console.log('Connected to MongoDB');
  app.listen(5000,()=>console.log("server running at port 5000"));
  })
  .catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  });
