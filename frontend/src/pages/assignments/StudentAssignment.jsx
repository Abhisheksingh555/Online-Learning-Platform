import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Award, CheckCircle, Clock, Download, Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const generateStudentAssignments = () => {
  return [
    {
      id: '1',
      title: 'Algebra Homework',
      description: 'Complete exercises 1-20 on page 45. Show all your work for full credit.\n\nRequirements:\n- Must show all steps\n- Final answers should be boxed\n- Submit as PDF',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      subject: 'Mathematics',
      teacher: 'Mr. Smith',
      points: 100,
      status: 'assigned',
      attachments: [
        { name: 'worksheet.pdf', url: '#', type: 'pdf' },
        { name: 'instructions.docx', url: '#', type: 'doc' }
      ],
      submission: null,
      grade: null,
      feedback: null
    },
    {
      id: '2',
      title: 'Science Lab Report',
      description: 'Write a lab report on the chemistry experiment we conducted last week. Include:\n1. Hypothesis\n2. Materials\n3. Procedure\n4. Results\n5. Conclusion',
      dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
      subject: 'Science',
      teacher: 'Ms. Johnson',
      points: 150,
      status: 'assigned',
      attachments: [
        { name: 'lab_guidelines.pdf', url: '#', type: 'pdf' },
        { name: 'experiment_data.xlsx', url: '#', type: 'xlsx' }
      ],
      submission: null,
      grade: null,
      feedback: null
    },
    {
      id: '3',
      title: 'History Essay',
      description: 'Write a 1000-word essay on the causes of World War II. Your essay should:\n- Be properly formatted with an introduction, body, and conclusion\n- Include at least 3 credible sources\n- Use MLA citation style',
      dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
      subject: 'History',
      teacher: 'Dr. Brown',
      points: 200,
      status: 'late',
      attachments: [
        { name: 'essay_rubric.pdf', url: '#', type: 'pdf' }
      ],
      submission: null,
      grade: null,
      feedback: null
    },
    {
      id: '4',
      title: 'Book Review',
      description: 'Submit your review of "To Kill a Mockingbird". Your review should:\n- Be 500-700 words\n- Include your personal opinion\n- Discuss themes and characters\n- Avoid spoilers',
      dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
      subject: 'English',
      teacher: 'Prof. Wilson',
      points: 100,
      status: 'submitted',
      submission: {
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        file: { name: 'book_review.docx', url: '#', type: 'docx' },
        comments: 'Submitted on time. I really enjoyed analyzing the themes in this book.'
      },
      grade: null,
      feedback: null
    },
    {
      id: '5',
      title: 'Art Portfolio',
      description: 'Submit your final art portfolio with at least 5 pieces. Include:\n- 2 drawings\n- 2 paintings\n- 1 sculpture or digital art\n\nEach piece should have a title and brief description.',
      dueDate: new Date(Date.now() - 86400000 * 7).toISOString(),
      subject: 'Art',
      teacher: 'Mrs. Davis',
      points: 150,
      status: 'graded',
      attachments: [
        { name: 'portfolio_requirements.pdf', url: '#', type: 'pdf' },
        { name: 'art_samples.zip', url: '#', type: 'zip' }
      ],
      submission: {
        date: new Date(Date.now() - 86400000 * 8).toISOString(),
        file: { name: 'my_portfolio.zip', url: '#', type: 'zip' },
        comments: 'Includes all required pieces plus 2 bonus works'
      },
      grade: {
        score: 135,
        outOf: 150,
        feedback: 'Excellent work! Your composition skills have improved significantly. The bonus pieces were a nice addition.'
      }
    }
  ];
};

const StudentAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submissionComments, setSubmissionComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const studentAssignments = generateStudentAssignments();
        setAssignments(studentAssignments);
        setError(null);
      } catch (err) {
        console.error('Failed to load assignments:', err);
        setError('Failed to load assignments. Please try again later.');
        setAssignments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const filteredAssignments = (assignments || []).filter(assignment => {
    if (!assignment) return false;
    
    const statusMatch = filter === 'all' || assignment.status === filter;
    const searchMatch = 
      (assignment.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (assignment.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (assignment.subject?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleFileChange = (e) => {
    setSubmissionFile(e.target.files[0]);
  };

  const handleSubmitAssignment = (e) => {
    e.preventDefault();
    if (!submissionFile || !selectedAssignment) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const updatedAssignments = assignments.map(a => {
        if (a?.id === selectedAssignment.id) {
          return {
            ...a,
            status: a.dueDate > new Date().toISOString() ? 'submitted' : 'late',
            submission: {
              date: new Date().toISOString(),
              file: {
                name: submissionFile.name,
                url: URL.createObjectURL(submissionFile),
                type: submissionFile.name.split('.').pop()
              },
              comments: submissionComments
            }
          };
        }
        return a;
      });
      
      setAssignments(updatedAssignments);
      setSelectedAssignment(null);
      setSubmissionFile(null);
      setSubmissionComments('');
      setIsSubmitting(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'assigned': return 'bg-electricBlue text-richblack-5';
      case 'submitted': return 'bg-yellow-500 text-richblack-5';
      case 'late': return 'bg-red-500 text-richblack-5';
      case 'graded': return 'bg-green-500 text-richblack-5';
      default: return 'bg-richblack-600 text-richblack-5';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'assigned': return 'Assigned';
      case 'submitted': return 'Submitted';
      case 'late': return 'Late';
      case 'graded': return 'Graded';
      default: return 'Unknown';
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day(s) ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else {
      return `in ${diffDays} day(s)`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleExpandAssignment = (id) => {
    setExpandedAssignment(expandedAssignment === id ? null : id);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-richblack-900 flex items-center justify-center">
        <div className="text-center p-6 bg-richblack-800 rounded-lg shadow-md max-w-md border border-richblack-700">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Assignments</h2>
          <p className="text-richblack-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-electricBlue text-richblack-5 rounded hover:bg-opacity-80 focus:ring-electricBlue"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-richblack-5">My Assignments</h1>
          <p className="text-richblack-300 mt-2">View and submit your assignments</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-richblack-400" />
            </div>
            <input
              type="text"
              placeholder="Search assignments..."
              className="block w-full pl-10 pr-3 py-2 border border-richblack-700 rounded-lg bg-richblack-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-electricBlue text-richblack-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-richblack-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-richblack-700 rounded-lg px-3 py-2 bg-richblack-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-electricBlue focus:border-electricBlue text-richblack-5"
            >
              <option value="all">All Assignments</option>
              <option value="assigned">Assigned</option>
              <option value="submitted">Submitted</option>
              <option value="late">Late</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-electricBlue"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments?.length > 0 ? (
              filteredAssignments.map(assignment => {
                if (!assignment) return null;
                
                return (
                  <div 
                    key={assignment.id} 
                    className="bg-richblack-800 rounded-lg shadow-md overflow-hidden border border-richblack-700"
                  >
                    <div 
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpandAssignment(assignment.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-richblack-5">{assignment.title}</h3>
                          <p className="text-sm text-richblack-300 mt-1 flex items-center gap-1">
                            <BookOpen className="h-4 w-4" /> {assignment.subject} • {assignment.teacher}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {getStatusText(assignment.status)}
                          </span>
                          {expandedAssignment === assignment.id ? (
                            <ChevronUp className="h-5 w-5 text-richblack-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-richblack-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center text-sm text-richblack-400">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Due {formatDueDate(assignment.dueDate)}</span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-richblack-100">
                          <Award className="h-4 w-4 mr-1" />
                          <span>{assignment.points} pts</span>
                        </div>
                      </div>
                    </div>
                    
                    {expandedAssignment === assignment.id && (
                      <div className="px-6 pb-6 pt-2 border-t border-richblack-700">
                        <p className="text-richblack-300 whitespace-pre-line mb-4">{assignment.description}</p>
                        
                        {(assignment.attachments?.length ?? 0) > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-richblack-300 mb-2">Attachments:</h4>
                            <div className="space-y-1">
                              {assignment.attachments?.map((file, index) => (
                                file && (
                                  <a 
                                    key={index} 
                                    href={file.url} 
                                    download
                                    className="flex items-center text-electricBlue hover:text-opacity-80 text-sm"
                                  >
                                    <Download className="h-4 w-4 mr-2" /> {file.name}
                                  </a>
                                )
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {(assignment.status === 'assigned' || assignment.status === 'late') && (
                          <button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="mt-4 w-full md:w-auto px-4 py-2 bg-electricBlue hover:bg-opacity-80 rounded-lg text-richblack-900 font-medium"
                          >
                            Submit Assignment
                          </button>
                        )}
                        
                        {assignment.status === 'submitted' && (
                          <div className="mt-4 bg-richblack-700 p-4 rounded-md border border-richblack-600">
                            <div className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-electricBlue" />
                              <span className="ml-2 text-sm font-medium text-richblack-100">
                                Submitted on {formatDate(assignment.submission?.date)}
                              </span>
                            </div>
                            
                            <div className="mt-3">
                              <a 
                                href={assignment.submission?.file?.url} 
                                download
                                className="flex items-center text-electricBlue hover:text-opacity-80"
                              >
                                <Download className="h-4 w-4 mr-2" /> {assignment.submission?.file?.name}
                              </a>
                            </div>
                            
                            {assignment.submission?.comments && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-richblack-300">Your comments:</p>
                                <p className="text-sm text-richblack-300 mt-1">{assignment.submission.comments}</p>
                              </div>
                            )}
                            
                            <div className="mt-3 text-sm text-richblack-400 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>Waiting for teacher to grade your submission</span>
                            </div>
                          </div>
                        )}
                        
                        {assignment.status === 'graded' && (
                          <div className="mt-4 bg-richblack-700 p-4 rounded-md border border-richblack-600">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-richblack-300">Grade:</span>
                                <span className="ml-2 text-lg font-bold text-green-400">
                                  {assignment.grade?.score}/{assignment.grade?.outOf}
                                </span>
                              </div>
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500 bg-opacity-20 text-green-400">
                                {Math.round(((assignment.grade?.score || 0) / (assignment.grade?.outOf || 1)) * 100)}%
                              </span>
                            </div>
                            
                            <div className="mt-3">
                              <p className="text-sm font-medium text-richblack-300">Teacher Feedback:</p>
                              <p className="text-sm text-richblack-300 mt-1 whitespace-pre-line">{assignment.grade?.feedback}</p>
                            </div>
                            
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-richblack-300">Your Submission:</h4>
                              <div className="mt-2 bg-richblack-800 p-3 rounded-md border border-richblack-600">
                                <p className="text-sm text-richblack-400">Submitted on {formatDate(assignment.submission?.date)}</p>
                                <a 
                                  href={assignment.submission?.file?.url} 
                                  download
                                  className="flex items-center text-electricBlue hover:text-opacity-80 mt-1"
                                >
                                  <Download className="h-4 w-4 mr-2" /> {assignment.submission?.file?.name}
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 bg-richblack-800 rounded-lg shadow border border-richblack-700">
                <p className="text-richblack-400">No assignments found matching your criteria</p>
              </div>
            )}
          </div>
        )}

        {selectedAssignment && (
          <div className="fixed inset-0 bg-richblack-900 bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-richblack-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-richblack-700">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-richblack-5">{selectedAssignment.title}</h2>
                    <p className="text-sm text-richblack-300 mt-1 flex items-center gap-1">
                      <BookOpen className="h-4 w-4" /> {selectedAssignment.subject} • {selectedAssignment.teacher}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedAssignment(null)}
                    className="text-richblack-400 hover:text-richblack-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedAssignment.status)}`}>
                    {getStatusText(selectedAssignment.status)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-richblack-700 text-richblack-100">
                    <Calendar className="h-3 w-3 mr-1" /> Due {formatDueDate(selectedAssignment.dueDate)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-richblack-700 text-richblack-100">
                    <Award className="h-3 w-3 mr-1" /> {selectedAssignment.points} points
                  </span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-richblack-5">Description</h3>
                  <p className="mt-2 text-richblack-300 whitespace-pre-line">{selectedAssignment.description}</p>
                </div>
                
                {(selectedAssignment.attachments?.length ?? 0) > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-richblack-5">Attachments</h3>
                    <div className="mt-2 space-y-2">
                      {selectedAssignment.attachments?.map((file, index) => (
                        file && (
                          <a 
                            key={index} 
                            href={file.url} 
                            download
                            className="flex items-center text-electricBlue hover:text-opacity-80"
                          >
                            <Download className="h-4 w-4 mr-2" /> {file.name}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-richblack-5">Submit Assignment</h3>
                  <form onSubmit={handleSubmitAssignment} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-richblack-300 mb-1">Upload your work</label>
                      <div className="mt-1 flex items-center">
                        <label className="cursor-pointer bg-richblack-700 py-2 px-3 border border-richblack-600 rounded-md shadow-sm text-sm leading-4 font-medium text-richblack-100 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-electricBlue">
                          <span>Choose file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <span className="ml-3 text-sm text-richblack-400">
                          {submissionFile ? submissionFile.name : 'No file chosen'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="comments" className="block text-sm font-medium text-richblack-300 mb-1">Comments (optional)</label>
                      <textarea
                        id="comments"
                        rows={3}
                        className="shadow-sm focus:ring-electricBlue focus:border-electricBlue block w-full sm:text-sm border border-richblack-600 rounded-md bg-richblack-700 text-richblack-100"
                        placeholder="Any additional comments for your teacher..."
                        value={submissionComments}
                        onChange={(e) => setSubmissionComments(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAssignment(null)}
                        className="inline-flex items-center px-4 py-2 border border-richblack-600 shadow-sm text-sm font-medium rounded-md text-richblack-100 bg-richblack-700 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electricBlue"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-richblack-5 bg-electricBlue hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electricBlue disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-richblack-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          'Submit Assignment'
                        )}
                      </button>
                    </div>
                  </form>
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