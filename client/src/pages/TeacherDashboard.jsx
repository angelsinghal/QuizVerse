import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

export default function TeacherDashboard() {
  const [pdfFile, setPdfFile] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/quiz');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert('Please select a PDF file.');

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      await axios.post('http://localhost:5000/api/quiz/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Quiz created from PDF successfully!');
      fetchQuizzes();
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  const toggleLiveStatus = async (quizId, currentStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/quiz/${quizId}/toggle`, {
        live: !currentStatus,
      });
      fetchQuizzes();
    } catch (error) {
      console.error('Error toggling quiz status:', error);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:5000/api/quiz/${quizId}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const viewAttempts = (quizId) => {
    // You can later route to a new page with detailed attempts
    console.log(`View responses for quiz ID: ${quizId}`);
  };

  return (
    <div>
      <Header />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Teacher Dashboard</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Create Quiz from PDF</h3>
          <form className="flex gap-4 items-center">
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button type="submit"  onSubmit={handlePdfSubmit} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Upload PDF
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Your Quizzes</h3>
          {quizzes.length === 0 ? (
            <p>No quizzes available.</p>
          ) : (
            <ul className="space-y-4">
              {quizzes.map((quiz) => (
                <li key={quiz._id} className="border p-4 rounded shadow-md">
                  <h4 className="text-md font-bold">{quiz.name}</h4>
                  <p className="text-sm">Created by: {quiz.createdBy.name}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => toggleLiveStatus(quiz._id, quiz.live)}
                      className={`py-1 px-3 rounded text-white ${
                        quiz.live ? 'bg-green-600' : 'bg-gray-500'
                      }`}
                    >
                      Set {quiz.live ? 'Draft' : 'Live'}
                    </button>
                    <button
                      onClick={() => deleteQuiz(quiz._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => viewAttempts(quiz._id)}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded"
                    >
                      View Attempts
                    </button>
                    {/* Optionally: Add an Edit Quiz button */}
                    {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded">Edit</button> */}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
