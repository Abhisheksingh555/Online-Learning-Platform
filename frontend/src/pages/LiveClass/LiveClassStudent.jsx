import React, { useState } from 'react';
import { FaPlayCircle, FaVideo, FaCalendarAlt, FaClock, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LiveClassStudent = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  // Sample data for live classes
  const liveClasses = {
    upcoming: [
      { 
        id: 1, 
        title: 'JavaScript Fundamentals', 
        time: '2025-04-09T10:00:00', 
        instructor: 'Dr. Sarah Johnson',
        duration: '90 mins',
        description: 'Learn core JavaScript concepts including variables, functions, and control flow.',
        thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW4oO1yc2Nktqr2-hAltLQ3oTocSNGLK1Eyw&s',
        recorded: false 
      },
      { 
        id: 3, 
        title: 'Node.js Essentials', 
        time: '2025-04-10T11:00:00', 
        instructor: 'Prof. Michael Chen',
        duration: '120 mins',
        description: 'Introduction to Node.js runtime environment and building server-side applications.',
        thumbnail: 'https://miro.medium.com/v2/resize:fit:1400/1*rC5I3G2F8PJcspg1nxdVTQ.png',
        recorded: false 
      },
      { 
        id: 10, 
        title: 'Node.js Essentials', 
        time: '2025-04-10T11:00:00', 
        instructor: 'Prof. Michael Chen',
        duration: '120 mins',
        description: 'Introduction to Node.js runtime environment and building server-side applications.',
        thumbnail: 'https://miro.medium.com/v2/resize:fit:1400/1*rC5I3G2F8PJcspg1nxdVTQ.png',
        recorded: false 
      },
      { 
        id: 11, 
        title: 'JavaScript Fundamentals', 
        time: '2025-04-09T10:00:00', 
        instructor: 'Dr. Sarah Johnson',
        duration: '90 mins',
        description: 'Learn core JavaScript concepts including variables, functions, and control flow.',
        thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW4oO1yc2Nktqr2-hAltLQ3oTocSNGLK1Eyw&s',
        recorded: false 
      },
    ],
    recorded: [
      { 
        id: 2, 
        title: 'Advanced React Patterns', 
        time: '2025-04-09T14:00:00', 
        instructor: 'Dr. Emily Rodriguez',
        duration: '105 mins',
        description: 'Explore advanced React concepts including hooks, context, and performance optimization.',
        thumbnail: 'https://source.unsplash.com/random/300x200/?react',
        recorded: true,
        views: 1245,
        rating: 4.8
      },
      { 
        id: 4, 
        title: 'CSS Mastery', 
        time: '2025-03-28T09:30:00', 
        instructor: 'Prof. David Wilson',
        duration: '90 mins',
        description: 'Master modern CSS techniques including Flexbox, Grid, and animations.',
        thumbnail: 'https://source.unsplash.com/random/300x200/?css',
        recorded: true,
        views: 876,
        rating: 4.6
      },
    ]
  };

  const handleClassClick = (liveClass) => {
    setSelectedClass(liveClass);
    setModalVisible(true);
  };

  const handleJoinClass = () => {
    if (studentName && studentEmail) {
      // Simulate joining class
      setModalVisible(false);
      alert(`Welcome ${studentName}! You're now joining ${selectedClass.title}`);
    } else {
      alert('Please enter your name and email');
    }
  };

  const handleViewRecordedClass = (classId) => {
    alert(`Opening recorded session for class ID: ${classId}`);
  };

  const formatDateTime = (dateTime) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateTime).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center text-[#2C3E50] mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Interactive Learning Portal
        </motion.h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-white shadow-md p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 rounded-full transition-all ${activeTab === 'upcoming' ? 'bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white' : 'text-gray-600'}`}
            >
              Upcoming Classes
            </button>
            <button
              onClick={() => setActiveTab('recorded')}
              className={`px-6 py-2 rounded-full transition-all ${activeTab === 'recorded' ? 'bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white' : 'text-gray-600'}`}
            >
              Recorded Sessions
            </button>
          </div>
        </div>

        {/* Class Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {liveClasses[activeTab].map((liveClass) => (
            <motion.div
              key={liveClass.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ y: -5 }}
              layout
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={liveClass.thumbnail} 
                  alt={liveClass.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-xl font-bold text-white">{liveClass.title}</h2>
                  <p className="text-sm text-white flex items-center gap-1">
                    <FaChalkboardTeacher className="inline" /> {liveClass.instructor}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt /> {new Date(liveClass.time).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock /> {new Date(liveClass.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{liveClass.description}</p>

                {liveClass.recorded ? (
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <span className="text-yellow-500">★ {liveClass.rating}</span> ({liveClass.views} views)
                    </div>
                    <button
                      onClick={() => handleViewRecordedClass(liveClass.id)}
                      className="bg-gradient-to-r from-[#38BDF8] to-[#2EC4B6] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:shadow-lg transition-all"
                    >
                      <FaVideo />
                      Watch Now
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleClassClick(liveClass)}
                    className="w-full bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <FaPlayCircle />
                    Join Live Session
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for joining live class */}
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
                  <h3 className="text-2xl font-bold">Join Class</h3>
                  <p className="font-medium">{selectedClass?.title}</p>
                  <p className="text-sm opacity-90">{formatDateTime(selectedClass?.time)}</p>
                </div>

                <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-5">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaUserGraduate /> Your Name
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      onClick={() => setModalVisible(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleJoinClass}
                      className="px-6 py-2 bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-white rounded-lg hover:shadow-md transition-all"
                    >
                      Join Now
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

export default LiveClassStudent;