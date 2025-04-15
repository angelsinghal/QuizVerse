import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quizzes');
        setQuizzes(response.data.filter((quiz) => quiz.live === true));
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);

  const handleAttemptQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div>
      <Header  />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Live Quizzes</h2>
        {quizzes.length === 0 ? (
          <p>No live quizzes available at the moment.</p>
        ) : (
          <ul>
            {quizzes.map((quiz) => (
              <li key={quiz._id} className="mb-4">
                <div className="border p-4 rounded shadow-md">
                  <h3 className="text-lg font-semibold">{quiz.name}</h3>
                  <p className="text-sm">Created by: {quiz.createdBy.name}</p>
                  <button
                    onClick={() => handleAttemptQuiz(quiz._id)}
                    className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Attempt Quiz
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
