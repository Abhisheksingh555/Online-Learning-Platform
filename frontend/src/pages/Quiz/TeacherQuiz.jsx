import React, { useState } from 'react';

const TeacherQuiz = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDuration, setQuizDuration] = useState(30);
  const [scheduledDate, setScheduledDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  const [uploadOption, setUploadOption] = useState('text');
  const [quizFile, setQuizFile] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setQuizFile(file);
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    const newQuiz = {
      id: Date.now(),
      title: quizTitle,
      description: quizDescription,
      duration: quizDuration,
      questions: questions.filter(q => q.text.trim() !== ''),
      scheduledAt: scheduledDate,
      dueAt: dueDate,
      createdAt: new Date().toISOString()
    };
    setQuizzes([...quizzes, newQuiz]);
    setQuizTitle('');
    setQuizDescription('');
    setQuizDuration(30);
    setScheduledDate('');
    setDueDate('');
    setQuestions([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    alert('Quiz created successfully!');
  };

  const handlePublishQuiz = (quizId) => {
    alert(`Quiz ${quizId} published to students!`);
  };

  const handleDeleteQuiz = (quizId) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  return (
    <div className="container mx-auto px-4 py-8 text-richblack-5">
      <h1 className="text-3xl font-bold mb-8 text-richblack-5">Quiz Management</h1>

      <div className="flex border-b border-richblack-700 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'create' ? 'text-[#00A1E4] border-b-2 border-[#00A1E4]' : 'text-richblack-300'}`}
          onClick={() => setActiveTab('create')}
        >
          Create New Quiz
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'manage' ? 'text-[#00A1E4] border-b-2 border-[#00A1E4]' : 'text-richblack-300'}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Quizzes
        </button>
      </div>

      {activeTab === 'create' ? (
        <div className="bg-richblack-800 rounded-lg shadow-md p-6 border border-richblack-700">
          <h2 className="text-xl font-semibold mb-4 text-richblack-5">Create New Quiz</h2>

          <div className="mb-6">
            <label className="block text-richblack-300 mb-2">Upload Method</label>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded ${uploadOption === 'text' ? 'bg-[#00A1E4] text-white' : 'bg-richblack-600 text-richblack-300'}`}
                onClick={() => setUploadOption('text')}
              >
                Enter Questions
              </button>
              <button
                className={`px-4 py-2 rounded ${uploadOption === 'file' ? 'bg-[#00A1E4] text-white' : 'bg-richblack-600 text-richblack-300'}`}
                onClick={() => setUploadOption('file')}
              >
                Upload File
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmitQuiz}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-richblack-300 mb-2">Quiz Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-richblack-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-richblack-300 mb-2">Scheduled Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-richblack-300 mb-2">Due Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-richblack-300 mb-2">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-richblack-700 bg-richblack-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                rows="3"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              />
            </div>

            {uploadOption === 'text' ? (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-richblack-5">Questions</h3>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="bg-[#2EC4B6] hover:bg-teal-500 text-white px-4 py-2 rounded transition duration-200"
                  >
                    Add Question
                  </button>
                </div>

                <div className="space-y-6">
                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="border border-richblack-700 rounded-lg p-4 bg-richblack-700">
                      <div className="flex justify-between mb-3">
                        <span className="font-medium text-richblack-5">Question {qIndex + 1}</span>
                        {questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="text-red-400 hover:text-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-richblack-300 mb-2">Question Text</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-richblack-600 bg-richblack-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                          value={question.text}
                          onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-richblack-300 mb-2">Options</label>
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3">
                              <input
                                type="radio"
                                name={`correctAnswer-${qIndex}`}
                                className="accent-[#00A1E4]"
                                checked={question.correctAnswer === oIndex}
                                onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                              />
                              <input
                                type="text"
                                className="flex-1 px-4 py-2 border border-richblack-600 bg-richblack-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A1E4]"
                                value={option}
                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-richblack-300 mb-2">Upload Quiz File</label>
                <div className="border-2 border-dashed border-richblack-600 rounded-lg p-6 text-center text-richblack-300">
                  <input
                    type="file"
                    className="hidden"
                    id="quizFile"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="quizFile" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <p className="mb-1">
                        {quizFile ? quizFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-richblack-400">PDF or TEXT file</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#2EC4B6] hover:bg-teal-500 text-white font-medium py-2 px-6 rounded transition duration-200"
              >
                Save Quiz
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-richblack-5">Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <div className="bg-richblack-800 rounded-lg shadow-md p-8 border border-richblack-700 text-center text-richblack-300">
              <p>No quizzes created yet.</p>
            </div>
          ) : (
            <div className="bg-richblack-800 rounded-lg shadow-md overflow-hidden border border-richblack-700">
              <table className="min-w-full divide-y divide-richblack-600 text-richblack-300">
                <thead className="bg-richblack-700 text-richblack-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Scheduled</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-richblack-600">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-white">{quiz.title}</div>
                        <div className="text-sm text-richblack-400">{quiz.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{quiz.questions.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{quiz.duration} mins</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(quiz.scheduledAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#00A1E4] text-white">
                          Draft
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handlePublishQuiz(quiz.id)}
                          className="text-[#2EC4B6] hover:text-teal-400 mr-4"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherQuiz;
