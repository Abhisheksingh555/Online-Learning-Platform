import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileText, BookOpen, Calendar, Award, Search, Filter, Download, Upload, Check, Clock } from 'lucide-react';

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
const classes = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

// Generate dummy assignments similar to teacher view but with submission status
const generateDummyAssignments = () => {
  const dummyTitles = [
    'Algebra Homework',
    'Science Project',
    'Essay Writing',
    'History Report',
    'Art Portfolio',
    'Physics Lab Report',
    'Book Review',
    'Math Quiz',
    'Chemistry Experiment',
    'Creative Writing'
  ];

  return Array.from({ length: 10 }, (_, i) => ({
    id: uuidv4(),
    title: dummyTitles[i % dummyTitles.length],
    description: `This is a sample assignment description for ${dummyTitles[i % dummyTitles.length]}. Complete all questions and submit by the due date.`,
    dueDate: new Date(Date.now() + 86400000 * (i + 1)).toISOString().split('T')[0],
    subject: subjects[i % subjects.length],
    class: classes[i % classes.length],
    points: [50, 100, 75, 150, 200][i % 5],
    attachments: [
      { name: `assignment_${i + 1}.pdf`, url: '#', type: 'pdf' },
      ...(i % 3 === 0 ? [{ name: `resources_${i + 1}.zip`, url: '#', type: 'zip' }] : [])
    ],
    createdAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
    status: 'assigned',
    // Student-specific submission data
    submission: Math.random() > 0.3 ? {
      id: uuidv4(),
      submittedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 3)).toISOString(),
      file: { name: `my_submission_${i + 1}.pdf`, url: '#', type: 'pdf' },
      grade: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 50 : null,
      feedback: Math.random() > 0.5 ? 'Good work! Keep it up.' : null,
      status: Math.random() > 0.5 ? 'submitted' : 'graded'
    } : null
  }));
};

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load dummy data on first render
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dummyAssignments = generateDummyAssignments();
        
        // Split into active and completed assignments
        const active = dummyAssignments.filter(a => !a.submission || a.submission.status !== 'graded');
        const completed = dummyAssignments.filter(a => a.submission?.status === 'graded');
        
        setAssignments(active);
        setCompletedAssignments(completed);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmissionFile({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.name.split('.').pop()
      });
    }
  };

  const handleSubmitAssignment = (assignmentId) => {
    if (!submissionFile) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newSubmission = {
        id: uuidv4(),
        submittedAt: new Date().toISOString(),
        file: submissionFile,
        grade: null,
        feedback: null,
        status: 'submitted'
      };
      
      // Update the assignment
      setAssignments(assignments.map(a => 
        a.id === assignmentId ? { ...a, submission: newSubmission } : a
      ));
      
      // Move to completed if graded immediately (for demo)
      if (Math.random() > 0.7) {
        setAssignments(assignments.filter(a => a.id !== assignmentId));
        setCompletedAssignments([
          ...completedAssignments,
          {
            ...assignments.find(a => a.id === assignmentId),
            submission: { ...newSubmission, status: 'graded', grade: Math.floor(Math.random() * 50) + 50 }
          }
        ]);
      }
      
      setSelectedAssignment(null);
      setSubmissionFile(null);
      setIsSubmitting(false);
    }, 1500);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'graded': return 'bg-green-500';
      case 'submitted': return 'bg-blue-500';
      case 'late': return 'bg-red-500';
      default: return 'bg-richblack-600';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'graded': return 'Graded';
      case 'submitted': return 'Submitted';
      case 'late': return 'Late';
      default: return 'Assigned';
    }
  };

  const filteredAssignments = assignments.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = filterSubject === 'all' || a.subject === filterSubject;
    return searchMatch && subjectMatch;
  });

  const filteredCompleted = completedAssignments.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = filterSubject === 'all' || a.subject === filterSubject;
    return searchMatch && subjectMatch;
  });

  const isAssignmentLate = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-richblack-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-richblack-5">My Assignments</h1>
            <p className="text-richblack-300 mt-1">
              {activeTab === 'active' 
                ? `You have ${assignments.length} active assignments` 
                : `Viewing ${completedAssignments.length} completed assignments`}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-richblack-700 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium ${activeTab === 'active' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
          >
            Active Assignments
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
          >
            Completed Assignments
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-richblack-400" />
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              className="block w-full pl-10 pr-3 py-2 border border-richblack-700 rounded-lg bg-richblack-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-electricBlue text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-richblack-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-richblack-700 rounded-lg px-3 py-2 bg-richblack-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-electricBlue text-white"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electricBlue"></div>
          </div>
        ) : (
          <>
            {/* Active Assignments Tab */}
            {activeTab === 'active' && (
              <>
                {filteredAssignments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssignments.map(a => (
                      <div key={a.id} className="bg-richblack-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-richblack-700">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h2 className="text-xl font-semibold text-richblack-5">{a.title}</h2>
                            <p className="text-richblack-300 text-sm flex items-center gap-1 mt-1">
                              <BookOpen size={14} /> {a.subject} • {a.class}
                            </p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            a.submission ? getStatusColor(a.submission.status) : 
                            isAssignmentLate(a.dueDate) ? 'bg-red-500' : 'bg-richblack-600'
                          }`}>
                            {a.submission ? getStatusText(a.submission.status) : 
                             isAssignmentLate(a.dueDate) ? 'Late' : 'Assigned'}
                          </span>
                        </div>
                        
                        <p className="text-richblack-400 text-sm line-clamp-3 mb-4">{a.description}</p>
                        
                        <div className="flex justify-between text-sm text-richblack-300 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> Due: {formatDate(a.dueDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Award size={14} /> {a.points} pts
                          </span>
                        </div>
                        
                        {a.attachments?.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-richblack-400 mb-1">Assignment Files:</p>
                            <div className="flex flex-wrap gap-1">
                              {a.attachments.map((file, index) => (
                                <a 
                                  key={index} 
                                  href={file.url} 
                                  className="inline-flex items-center text-xs text-electricBlue hover:text-opacity-80"
                                  download
                                >
                                  <Download className="h-3 w-3 mr-1" /> {file.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedAssignment(a)}
                            className="flex-1 bg-richblack-700 hover:bg-richblack-600 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1"
                          >
                            View Details
                          </button>
                          {!a.submission && (
                            <button 
                              onClick={() => setSelectedAssignment(a)}
                              className="flex-1 bg-electricBlue hover:bg-opacity-80 py-2 rounded-lg text-richblack-900 font-medium text-sm flex items-center justify-center gap-1"
                            >
                              <Upload size={14} /> Submit
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-richblack-400 mt-10 py-10 bg-richblack-800 rounded-xl border border-richblack-700">
                    <p className="text-lg">No active assignments</p>
                    <p className="mt-2">All your assignments are completed or not yet assigned</p>
                  </div>
                )}
              </>
            )}

            {/* Completed Assignments Tab */}
            {activeTab === 'completed' && (
              <>
                {filteredCompleted.length > 0 ? (
                  <div className="bg-richblack-800 rounded-xl overflow-hidden border border-richblack-700">
                    <table className="w-full">
                      <thead className="bg-richblack-700 text-richblack-50">
                        <tr>
                          <th className="py-3 px-4 text-left">Assignment</th>
                          <th className="py-3 px-4 text-left">Subject</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left">Grade</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCompleted.map(a => (
                          <tr 
                            key={a.id} 
                            className="border-b border-richblack-700 hover:bg-richblack-750 cursor-pointer"
                            onClick={() => setSelectedAssignment(a)}
                          >
                            <td className="py-3 px-4">{a.title}</td>
                            <td className="py-3 px-4">{a.subject}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(a.submission?.status)}`}>
                                {getStatusText(a.submission?.status)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {a.submission?.grade ? (
                                <span className="font-medium">{a.submission.grade}/{a.points}</span>
                              ) : (
                                <span className="text-richblack-400">Not graded</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => setSelectedAssignment(a)}
                                className="text-electricBlue hover:text-opacity-80 text-sm"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-richblack-400 mt-10 py-10 bg-richblack-800 rounded-xl border border-richblack-700">
                    <p className="text-lg">No completed assignments</p>
                    <p className="mt-2">Your completed assignments will appear here</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Assignment Detail & Submission Modal */}
        {selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-richblack-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-richblack-700">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-richblack-5">{selectedAssignment.title}</h2>
                    <p className="text-sm text-richblack-300 mt-1 flex items-center gap-1">
                      <BookOpen size={14} /> {selectedAssignment.subject} • {selectedAssignment.class}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedAssignment(null);
                      setSubmissionFile(null);
                    }}
                    className="text-richblack-400 hover:text-richblack-300"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedAssignment.submission ? getStatusColor(selectedAssignment.submission.status) : 
                    isAssignmentLate(selectedAssignment.dueDate) ? 'bg-red-500' : 'bg-richblack-600'
                  }`}>
                    {selectedAssignment.submission ? getStatusText(selectedAssignment.submission.status) : 
                     isAssignmentLate(selectedAssignment.dueDate) ? 'Late' : 'Assigned'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-richblack-700 text-richblack-100">
                    <Calendar size={14} className="mr-1" /> Due: {formatDate(selectedAssignment.dueDate)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-richblack-700 text-richblack-100">
                    <Award size={14} className="mr-1" /> {selectedAssignment.points} points
                  </span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-richblack-5">Description</h3>
                  <p className="mt-2 text-richblack-300 whitespace-pre-line">{selectedAssignment.description}</p>
                </div>
                
                {selectedAssignment.attachments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-richblack-5">Assignment Files</h3>
                    <div className="mt-2 space-y-2">
                      {selectedAssignment.attachments.map((file, index) => (
                        <a 
                          key={index} 
                          href={file.url} 
                          download
                          className="flex items-center text-electricBlue hover:text-opacity-80"
                        >
                          <Download size={16} className="mr-2" /> {file.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Submission Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-richblack-5 mb-4">
                    {selectedAssignment.submission ? 'Your Submission' : 'Submit Assignment'}
                  </h3>
                  
                  {selectedAssignment.submission ? (
                    <div className="bg-richblack-700 rounded-lg p-4 border border-richblack-600">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-richblack-100">
                            Submitted on: {formatDate(selectedAssignment.submission.submittedAt)}
                          </span>
                          {selectedAssignment.submission.status === 'graded' && (
                            <span className="flex items-center gap-1 text-sm bg-green-500/20 px-2 py-1 rounded-full">
                              <Check size={14} /> Graded
                            </span>
                          )}
                          {selectedAssignment.submission.status === 'submitted' && (
                            <span className="flex items-center gap-1 text-sm bg-blue-500/20 px-2 py-1 rounded-full">
                              <Clock size={14} /> Pending Review
                            </span>
                          )}
                        </div>
                        <a 
                          href={selectedAssignment.submission.file.url} 
                          download
                          className="text-electricBlue hover:text-opacity-80 text-sm flex items-center"
                        >
                          <Download size={14} className="mr-1" /> Download
                        </a>
                      </div>
                      
                      {selectedAssignment.submission.grade && (
                        <div className="mt-4">
                          <h4 className="text-md font-medium text-richblack-100 mb-2">Grading</h4>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xl font-bold text-green-500">
                                {selectedAssignment.submission.grade}/{selectedAssignment.points}
                              </span>
                              <span className="ml-2 text-richblack-300">
                                ({Math.round((selectedAssignment.submission.grade / selectedAssignment.points) * 100)}%)
                              </span>
                            </div>
                            {selectedAssignment.submission.feedback && (
                              <div className="bg-richblack-600/50 p-2 rounded-lg">
                                <p className="text-sm text-richblack-100">
                                  {selectedAssignment.submission.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-richblack-700 rounded-lg p-4 border border-richblack-600">
                      {submissionFile ? (
                        <div className="mb-4">
                          <p className="text-sm text-richblack-300 mb-2">Selected file:</p>
                          <div className="flex items-center justify-between bg-richblack-800 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText size={18} />
                              <span className="text-richblack-100">{submissionFile.name}</span>
                            </div>
                            <button 
                              onClick={() => setSubmissionFile(null)}
                              className="text-red-500 hover:text-red-400"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-richblack-600 rounded-lg p-6 text-center">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Upload size={24} className="text-richblack-400" />
                            <p className="text-richblack-300">Upload your submission file</p>
                            <label className="cursor-pointer bg-richblack-600 py-2 px-4 rounded-md shadow-sm text-sm leading-4 font-medium text-richblack-100 hover:bg-opacity-80 mt-2">
                              <span>Select File</span>
                              <input 
                                type="file" 
                                onChange={handleFileUpload} 
                                className="sr-only" 
                              />
                            </label>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleSubmitAssignment(selectedAssignment.id)}
                          disabled={!submissionFile || isSubmitting}
                          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                            !submissionFile || isSubmitting
                              ? 'bg-richblack-600 text-richblack-400 cursor-not-allowed'
                              : 'bg-electricBlue hover:bg-opacity-80 text-richblack-900'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Upload size={16} /> Submit Assignment
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignment;