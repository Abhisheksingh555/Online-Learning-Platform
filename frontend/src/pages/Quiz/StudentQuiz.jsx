import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const StudentQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const mockQuizzes = [
      {
        id: 1,
        title: "Math Quiz 1",
        description: "Basic arithmetic quiz",
        duration: 30,
        questions: [
          { id: 1, text: "What is 2 + 2?", options: ["3", "4", "5", "6"], correctAnswer: 1 },
          { id: 2, text: "What is 5 × 3?", options: ["10", "15", "20", "25"], correctAnswer: 1 },
          { id: 3, text: "What is 10 ÷ 2?", options: ["2", "3", "5", "10"], correctAnswer: 2 }
        ],
        scheduledAt: "2023-06-15T10:00:00",
        dueAt: "2023-06-20T23:59:59"
      },
      {
        id: 2,
        title: "Science Quiz",
        description: "General science questions",
        duration: 20,
        questions: [
          { id: 1, text: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], correctAnswer: 0 },
          { id: 2, text: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswer: 1 }
        ],
        scheduledAt: "2023-06-18T09:00:00",
        dueAt: "2023-06-25T23:59:59"
      }
    ];
    setQuizzes(mockQuizzes);
  }, []);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeLeft(quiz.duration * 60);
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(timerInterval);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    let correct = 0;
    selectedQuiz.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) correct++;
    });

    const calculatedScore = (correct / selectedQuiz.questions.length) * 100;
    setScore(calculatedScore);
    setSubmitted(true);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Quiz Report: ${selectedQuiz.title}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Student: John Doe`, 14, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);
    doc.text(`Score: ${score.toFixed(2)}%`, 14, 42);

    const tableData = selectedQuiz.questions.map(question => {
      const studentAnswer = answers[question.id] !== undefined ? question.options[answers[question.id]] : "Not answered";
      const correctAnswer = question.options[question.correctAnswer];
      const isCorrect = answers[question.id] === question.correctAnswer;
      return [question.text, studentAnswer, correctAnswer, isCorrect ? "✓" : "✗"];
    });

    doc.autoTable({
      startY: 50,
      head: [['Question', 'Your Answer', 'Correct Answer', 'Result']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 161, 228], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 }, 3: { cellWidth: 20 } }
    });

    doc.save(`Quiz_Report_${selectedQuiz.title.replace(/\s+/g, '_')}.pdf`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!selectedQuiz) {
    return (
      <div className="container mx-auto px-4 py-8 bg-richblack-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-[#00A1E4]">Available Quizzes</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-richblack-800 text-white rounded-lg shadow-md p-6 border border-richblack-600">
              <h2 className="text-xl font-semibold mb-2 text-[#2EC4B6]">{quiz.title}</h2>
              <p className="text-richblack-300 mb-4">{quiz.description}</p>
              <div className="flex justify-between text-sm text-richblack-400 mb-4">
                <span>Duration: {quiz.duration} mins</span>
                <span>Due: {new Date(quiz.dueAt).toLocaleDateString()}</span>
              </div>
              <button
                onClick={() => startQuiz(quiz)}
                className="w-full bg-[#00A1E4] hover:bg-[#0093ce] text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl text-white bg-richblack-900 min-h-screen">
        <div className="bg-richblack-800 rounded-lg shadow-md p-8 border border-richblack-600">
          <h1 className="text-2xl font-bold mb-4 text-[#00A1E4]">Quiz Results: {selectedQuiz.title}</h1>
          <div className="mb-6 p-4 bg-richblack-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-[#2EC4B6]">Your Score</h2>
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center border-8 border-[#2EC4B6] bg-richblack-900">
                <span className="text-2xl font-bold">{score.toFixed(1)}%</span>
              </div>
              <div className="ml-6">
                <p className="text-richblack-300">
                  Correct: {Object.keys(answers).filter(qId =>
                    answers[qId] === selectedQuiz.questions.find(q => q.id.toString() === qId.toString()).correctAnswer
                  ).length} / {selectedQuiz.questions.length}
                </p>
                <p className="text-richblack-300">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-[#2EC4B6]">Question Review</h2>
            <div className="space-y-6">
              {selectedQuiz.questions.map((question, index) => {
                const studentAnswer = answers[question.id] !== undefined
                  ? question.options[answers[question.id]]
                  : "Not answered";
                const isCorrect = answers[question.id] === question.correctAnswer;

                return (
                  <div key={question.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-900/20 border-green-400' : 'bg-red-900/20 border-red-400'}`}>
                    <p className="font-medium mb-2">{index + 1}. {question.text}</p>
                    <p className={`${isCorrect ? 'text-green-400' : 'text-red-400'} mb-1`}>
                      Your answer: {studentAnswer}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-300">Correct answer: {question.options[question.correctAnswer]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setSelectedQuiz(null)}
              className="bg-richblack-600 hover:bg-richblack-700 text-white font-medium py-2 px-6 rounded"
            >
              Back to Quizzes
            </button>
            <button
              onClick={generatePDFReport}
              className="bg-[#00A1E4] hover:bg-[#0093ce] text-white font-medium py-2 px-6 rounded flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  const totalQuestions = selectedQuiz.questions.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl text-white bg-richblack-900 min-h-screen">
      <div className="bg-richblack-800 rounded-lg shadow-md p-6 border border-richblack-600">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#00A1E4]">{selectedQuiz.title}</h1>
          <div className="bg-[#2EC4B6]/20 text-[#2EC4B6] px-3 py-1 rounded-full font-medium">
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-richblack-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>Progress: {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-richblack-700 rounded-full h-2.5">
            <div className="bg-[#00A1E4] h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                  answers[currentQuestion.id] === index
                    ? 'bg-[#00A1E4]/20 border-[#00A1E4]'
                    : 'hover:bg-richblack-700 border-richblack-600'
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`py-2 px-6 rounded ${
              currentQuestionIndex === 0
                ? 'bg-richblack-600 text-richblack-400 cursor-not-allowed'
                : 'bg-richblack-700 hover:bg-richblack-600 text-white'
            }`}
          >
            Previous
          </button>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-[#00A1E4] hover:bg-[#0093ce] text-white font-medium py-2 px-6 rounded"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;
