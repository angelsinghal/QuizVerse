import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState('');
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correct: '' }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: '' }]);
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/quizzes', { name: quizName, password, questions, createdBy: user._id });
      navigate('/teacher');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Create New Quiz</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Quiz Name"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Quiz Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div>
            {questions.map((q, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                {q.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...q.options];
                      updatedOptions[i] = e.target.value;
                      handleQuestionChange(index, 'options', updatedOptions);
                    }}
                    className="w-full p-2 mb-2 border rounded"
                    required
                  />
                ))}
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={q.correct}
                  onChange={(e) => handleQuestionChange(index, 'correct', e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Add Question
          </button>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  );
}
