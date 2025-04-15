import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';

export default function QuizAttempt() {
  const { id } = useParams(); // Quiz ID from the URL
  const { user, logout } = useAuth(); // Get user from auth context
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [score, setScore] = useState(null);

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${id}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };
    fetchQuiz();
  }, [id]);

  // Handle password input
  const handlePasswordChange = (e) => {
    setEnteredPassword(e.target.value);
  };

  // Check if password is correct
  const handlePasswordSubmit = () => {
    if (enteredPassword === quiz.password) {
      setIsPasswordCorrect(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Handle answer selection
  const handleAnswerChange = (questionIndex, answer) => {
    setStudentAnswers({ ...studentAnswers, [questionIndex]: answer });
  };

  // Submit quiz and update score
  const handleSubmitQuiz = async () => {
    let calculatedScore = 0;

    // Calculate the score based on answers
    quiz.questions.forEach((question, index) => {
      if (studentAnswers[index] === question.correct) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);

    try {
      // Make request to update the student's score in the backend
      await axios.put(
        `http://localhost:5000/api/students/${user._id}/quiz/${quiz._id}`,
        { score: calculatedScore },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'), // Use token from local storage
          },
        }
      );

      // Redirect to student dashboard after successful submission
      navigate('/student');
    } catch (error) {
      console.error('Error updating student score:', error);
    }
  };

  // If the quiz data hasn't loaded yet
  if (!quiz) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Attempt Quiz: {quiz.name}</h2>
        
        {/* Password Section */}
        {!isPasswordCorrect && (
          <div className="mb-6">
            <input
              type="password"
              placeholder="Enter Quiz Password"
              value={enteredPassword}
              onChange={handlePasswordChange}
              className="p-2 border rounded"
            />
            <button
              onClick={handlePasswordSubmit}
              className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}

        {/* Quiz Attempt Section */}
        {isPasswordCorrect && (
          <div>
            <h3 className="text-xl mb-4">Answer the Questions</h3>
            {quiz.questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p>{question.question}</p>
                {question.options.map((option, i) => (
                  <div key={i}>
                    <input
                      type="radio"
                      id={`question${index}_option${i}`}
                      name={`question${index}`}
                      value={option}
                      checked={studentAnswers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    <label htmlFor={`question${index}_option${i}`}>{option}</label>
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={handleSubmitQuiz}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Submit Quiz
            </button>
            {score !== null && (
              <div className="mt-4">
                <h3>Your Score: {score} / {quiz.questions.length}</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
