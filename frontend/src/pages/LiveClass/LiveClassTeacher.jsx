import React, { useState } from 'react';
import { 
  FaCalendarCheck, 
  FaClock, 
  FaPlusCircle, 
  FaChalkboardTeacher, 
  FaEdit, 
  FaTrash, 
  FaUser 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LiveClassTeacher = () => {
  const [classTitle, setClassTitle] = useState('');
  const [classDate, setClassDate] = useState('');
  const [classTime, setClassTime] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [classDuration, setClassDuration] = useState('60');
  const [scheduledClasses, setScheduledClasses] = useState([
    {
      id: 1,
      title: 'Advanced React Patterns',
      date: '2025-04-15',
      time: '14:00',
      description: 'Exploring advanced React concepts and best practices',
      duration: '90',
      students: 24
    },
    {
      id: 2,
      title: 'Node.js Fundamentals',
      date: '2025-04-17',
      time: '10:30',
      description: 'Introduction to Node.js and backend development',
      duration: '120',
      students: 18
    }
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const handleAddClass = () => {
    if (classTitle && classDate && classTime) {
      const newClass = {
        id: scheduledClasses.length + 1,
        title: classTitle,
        date: classDate,
        time: classTime,
        description: classDescription,
        duration: classDuration,
        students: 0
      };
      setScheduledClasses([...scheduledClasses, newClass]);
      resetForm();
      setModalVisible(false);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleEditClass = () => {
    if (classTitle && classDate && classTime) {
      const updatedClasses = scheduledClasses.map(cls => 
        cls.id === editingClass.id ? { 
          ...cls, 
          title: classTitle,
          date: classDate,
          time: classTime,
          description: classDescription,
          duration: classDuration
        } : cls
      );
      setScheduledClasses(updatedClasses);
      resetForm();
      setModalVisible(false);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleDeleteClass = (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setScheduledClasses(scheduledClasses.filter(cls => cls.id !== id));
    }
  };

  const resetForm = () => {
    setClassTitle('');
    setClassDate('');
    setClassTime('');
    setClassDescription('');
    setClassDuration('60');
    setEditingClass(null);
  };

  const openEditModal = (liveClass) => {
    setClassTitle(liveClass.title);
    setClassDate(liveClass.date);
    setClassTime(liveClass.time);
    setClassDescription(liveClass.description);
    setClassDuration(liveClass.duration);
    setEditingClass(liveClass);
    setModalVisible(true);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center text-[#2C3E50] mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Teacher Dashboard
        </motion.h1>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-xl font-semibold text-[#2C3E50]">
            <FaChalkboardTeacher className="inline mr-2" />
            My Scheduled Classes
          </div>
          <motion.button
            onClick={() => {
              resetForm();
              setModalVisible(true);
            }}
            className="bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlusCircle className="text-xl" />
            Schedule New Class
          </motion.button>
        </div>

        {/* Class Grid */}
        {scheduledClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scheduledClasses.map((liveClass) => (
              <motion.div
                key={liveClass.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative"
                whileHover={{ y: -5 }}
                layout
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => openEditModal(liveClass)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteClass(liveClass.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">{liveClass.title}</h2>
                  <p className="text-gray-600 mb-4">{liveClass.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaCalendarCheck className="text-[#2EC4B6]" />
                      <span>{formatDate(liveClass.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaClock className="text-[#2EC4B6]" />
                      <span>{liveClass.time} (Duration: {liveClass.duration} mins)</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaUser className="text-[#2EC4B6]" />
                      <span>{liveClass.students} students enrolled</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button className="text-sm text-[#2EC4B6] hover:underline">
                      View Attendance
                    </button>
                    <button className="bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white px-4 py-2 rounded-lg text-sm">
                      Start Class
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="bg-white rounded-xl p-8 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-semibold text-gray-600 mb-4">No classes scheduled yet</h3>
            <p className="text-gray-500 mb-6">Click the button above to schedule your first live class</p>
            <button
              onClick={() => setModalVisible(true)}
              className="bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white px-6 py-2 rounded-full inline-flex items-center gap-2"
            >
              <FaPlusCircle />
              Schedule Class
            </button>
          </motion.div>
        )}

        {/* Add/Edit Class Modal */}
        <AnimatePresence>
          {modalVisible && (
            <motion.div 
              className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] p-6 text-white">
                  <h3 className="text-2xl font-bold">
                    {editingClass ? 'Edit Class' : 'Schedule New Class'}
                  </h3>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Class Title*</label>
                    <input
                      type="text"
                      value={classTitle}
                      onChange={(e) => setClassTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                      placeholder="Enter class title"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Date*</label>
                      <input
                        type="date"
                        value={classDate}
                        onChange={(e) => setClassDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Time*</label>
                      <input
                        type="time"
                        value={classTime}
                        onChange={(e) => setClassTime(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                    <select
                      value={classDuration}
                      onChange={(e) => setClassDuration(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                    >
                      <option value="30">30 mins</option>
                      <option value="60">60 mins</option>
                      <option value="90">90 mins</option>
                      <option value="120">120 mins</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={classDescription}
                      onChange={(e) => setClassDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                      placeholder="Brief description of the class"
                      rows="3"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        resetForm();
                        setModalVisible(false);
                      }}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={editingClass ? handleEditClass : handleAddClass}
                      className="px-6 py-2 bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white rounded-lg hover:shadow-md"
                    >
                      {editingClass ? 'Save Changes' : 'Add Class'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveClassTeacher;
