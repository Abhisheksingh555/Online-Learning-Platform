import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Clock, FileText, BookOpen, Calendar, Award } from 'lucide-react';

const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Physical Education'];
const classes = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

// Generate dummy data for initial assignments
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

  return Array.from({ length: 5 }, (_, i) => ({
    id: uuidv4(),
    title: dummyTitles[i],
    description: `This is a sample assignment description for ${dummyTitles[i]}. Students should complete all questions and submit by the due date.`,
    dueDate: new Date(Date.now() + 86400000 * (i + 3)).toISOString().split('T')[0],
    subject: subjects[i % subjects.length],
    class: classes[i % classes.length],
    points: [50, 100, 75, 150, 200][i % 5],
    attachments: [],
    createdAt: new Date(Date.now() - 86400000 * (i + 1)).toISOString(),
    status: 'active'
  }));
};

const TeacherAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    subject: 'Mathematics',
    class: 'Grade 1',
    points: 100,
    attachments: []
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [formErrors, setFormErrors] = useState({});

  // Load dummy data on first render
  useEffect(() => {
    const dummyAssignments = generateDummyAssignments();
    setAssignments(dummyAssignments);
    
    // Generate some history items
    const historyItems = dummyAssignments.map(a => ({
      ...a,
      status: ['completed', 'graded', 'archived'][Math.floor(Math.random() * 3)],
      updatedAt: new Date(Date.now() - 86400000 * Math.floor(Math.random() * 30)).toISOString()
    }));
    setAssignmentHistory(historyItems);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!newAssignment.title.trim()) errors.title = 'Title is required';
    if (!newAssignment.description.trim()) errors.description = 'Description is required';
    if (!newAssignment.dueDate) errors.dueDate = 'Due date is required';
    if (newAssignment.points <= 0) errors.points = 'Points must be positive';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({ ...newAssignment, [name]: value });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleFileUpload = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const now = new Date().toISOString();
    
    if (isEditing) {
      // When editing, move the old version to history
      const oldAssignment = assignments.find(a => a.id === newAssignment.id);
      setAssignmentHistory([...assignmentHistory, { ...oldAssignment, status: 'updated', updatedAt: now }]);
      
      // Update the current assignment
      setAssignments(assignments.map(a => a.id === newAssignment.id ? 
        { ...newAssignment, updatedAt: now } : a));
    } else {
      // Create new assignment
      const assignmentWithId = { 
        ...newAssignment, 
        id: uuidv4(),
        createdAt: now,
        status: 'active'
      };
      setAssignments([...assignments, assignmentWithId]);
    }
    resetForm();
  };

  const handleEdit = (assignment) => {
    setNewAssignment(assignment);
    setIsEditing(true);
    setIsFormVisible(true);
  };

  const handleDelete = (id) => {
    // Move to history before deleting
    const deletedAssignment = assignments.find(a => a.id === id);
    setAssignmentHistory([...assignmentHistory, { ...deletedAssignment, status: 'deleted', updatedAt: new Date().toISOString() }]);
    
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleArchive = (id) => {
    // Archive an assignment (move to history)
    const archivedAssignment = assignments.find(a => a.id === id);
    setAssignmentHistory([...assignmentHistory, { ...archivedAssignment, status: 'archived', updatedAt: new Date().toISOString() }]);
    
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const resetForm = () => {
    setNewAssignment({
      id: '', title: '', description: '', dueDate: '', subject: 'Mathematics', class: 'Grade 1', points: 100, attachments: []
    });
    setIsEditing(false);
    setIsFormVisible(false);
    setFiles([]);
    setFormErrors({});
  };

  const filteredAssignments = assignments.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = filterSubject === 'all' || a.subject === filterSubject;
    return searchMatch && subjectMatch;
  });

  const filteredHistory = assignmentHistory.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.description.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = filterSubject === 'all' || a.subject === filterSubject;
    return searchMatch && subjectMatch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'graded': return 'bg-blue-500';
      case 'archived': return 'bg-gray-500';
      case 'deleted': return 'bg-red-500';
      case 'updated': return 'bg-yellow-500';
      default: return 'bg-electricBlue';
    }
  };

  return (
    <div className="min-h-screen px-4 md:px-6 py-8 bg-richblack-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-richblack-5">Assignment Manager</h1>
            <p className="text-richblack-300 mt-1">
              {activeTab === 'current' 
                ? `Managing ${assignments.length} active assignments` 
                : `Viewing ${assignmentHistory.length} historical records`}
            </p>
          </div>
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-electricBlue hover:bg-opacity-80 transition px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <FileText size={18} /> New Assignment
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-richblack-700 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 font-medium ${activeTab === 'current' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
          >
            Current Assignments
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-electricBlue border-b-2 border-electricBlue' : 'text-richblack-400'}`}
          >
            Assignment History
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search assignments..."
            className="flex-1 bg-richblack-800 text-white px-4 py-2 rounded-lg focus:outline-electricBlue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-richblack-800 text-white px-4 py-2 rounded-lg"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subj => (
              <option key={subj} value={subj}>{subj}</option>
            ))}
          </select>
        </div>

        {/* Current Assignments Tab */}
        {activeTab === 'current' && (
          <>
            {filteredAssignments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map(a => (
                  <div key={a.id} className="bg-richblack-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h2 className="text-xl font-semibold text-richblack-5">{a.title}</h2>
                        <p className="text-richblack-300 text-sm flex items-center gap-1 mt-1">
                          <BookOpen size={14} /> {a.subject} • {a.class}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(a.status)}`}>
                        Active
                      </span>
                    </div>
                    
                    <p className="text-richblack-400 text-sm line-clamp-3 mb-4">{a.description}</p>
                    
                    <div className="flex justify-between text-sm text-richblack-300 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> Due: {new Date(a.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award size={14} /> {a.points} pts
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(a)} 
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleArchive(a.id)} 
                        className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1"
                      >
                        Archive
                      </button>
                      <button 
                        onClick={() => handleDelete(a.id)} 
                        className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white text-sm flex items-center justify-center gap-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-richblack-400 mt-10 py-10 bg-richblack-800 rounded-xl">
                <p className="text-lg">No assignments found</p>
                <p className="mt-2">Try adjusting your search or create a new assignment</p>
                <button
                  onClick={() => setIsFormVisible(true)}
                  className="mt-4 bg-electricBlue hover:bg-opacity-80 transition px-4 py-2 rounded-lg font-semibold"
                >
                  + Create Assignment
                </button>
              </div>
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-richblack-800 rounded-xl overflow-hidden">
            {filteredHistory.length > 0 ? (
              <table className="w-full">
                <thead className="bg-richblack-700 text-richblack-50">
                  <tr>
                    <th className="py-3 px-4 text-left">Title</th>
                    <th className="py-3 px-4 text-left">Subject</th>
                    <th className="py-3 px-4 text-left">Class</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(a => (
                    <tr key={a.id} className="border-b border-richblack-700 hover:bg-richblack-750">
                      <td className="py-3 px-4">{a.title}</td>
                      <td className="py-3 px-4">{a.subject}</td>
                      <td className="py-3 px-4">{a.class}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(a.status)}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-richblack-300">
                        {new Date(a.updatedAt || a.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-richblack-400 p-10">
                <p className="text-lg">No history records found</p>
                <p className="mt-2">Assignment history will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Assignment Form Modal */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-richblack-800 p-6 rounded-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={resetForm} className="absolute top-4 right-4 text-richblack-400 hover:text-red-500">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold text-richblack-5 mb-4">
                {isEditing ? 'Edit Assignment' : 'Create Assignment'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input 
                      type="text" 
                      name="title" 
                      value={newAssignment.title} 
                      onChange={handleInputChange} 
                      placeholder="Title" 
                      className={`px-4 py-2 rounded-lg w-full ${formErrors.title ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700'} text-white`} 
                      required 
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                  </div>
                  
                  <div>
                    <select 
                      name="subject" 
                      value={newAssignment.subject} 
                      onChange={handleInputChange} 
                      className="px-4 py-2 rounded-lg w-full bg-richblack-700 text-white"
                    >
                      {subjects.map(subject => <option key={subject}>{subject}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <select 
                      name="class" 
                      value={newAssignment.class} 
                      onChange={handleInputChange} 
                      className="px-4 py-2 rounded-lg w-full bg-richblack-700 text-white"
                    >
                      {classes.map(cls => <option key={cls}>{cls}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <input 
                      type="date" 
                      name="dueDate" 
                      value={newAssignment.dueDate} 
                      onChange={handleInputChange} 
                      className={`px-4 py-2 rounded-lg w-full ${formErrors.dueDate ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700'} text-white`} 
                      required 
                    />
                    {formErrors.dueDate && <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>}
                  </div>
                  
                  <div>
                    <input 
                      type="number" 
                      name="points" 
                      value={newAssignment.points} 
                      onChange={handleInputChange} 
                      className={`px-4 py-2 rounded-lg w-full ${formErrors.points ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700'} text-white`} 
                      required 
                      min="1"
                    />
                    {formErrors.points && <p className="text-red-500 text-sm mt-1">{formErrors.points}</p>}
                  </div>
                </div>
                
                <div>
                  <textarea 
                    name="description" 
                    value={newAssignment.description} 
                    onChange={handleInputChange} 
                    placeholder="Description" 
                    className={`w-full px-4 py-2 rounded-lg ${formErrors.description ? 'bg-red-900/50 border border-red-500' : 'bg-richblack-700'} text-white`} 
                    rows="4" 
                    required
                  ></textarea>
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
                
                <div>
                  <label className="block text-richblack-300 mb-2">Attachments (optional)</label>
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileUpload} 
                    className="w-full bg-richblack-700 px-4 py-2 rounded-lg text-white" 
                  />
                  {files.length > 0 && (
                    <div className="mt-2 text-sm text-richblack-300">
                      {files.length} file(s) selected
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="px-4 py-2 bg-richblack-600 hover:bg-richblack-700 rounded-lg text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-electricBlue hover:bg-opacity-80 rounded-lg text-richblack-900 font-bold"
                  >
                    {isEditing ? 'Update Assignment' : 'Create Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAssignment;