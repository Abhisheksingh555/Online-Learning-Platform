import React from "react";
import { motion } from "framer-motion";
import { FaBookOpen, FaChartLine, FaStar, FaChevronRight } from "react-icons/fa";
import { MdSchool, MdOutlineQuiz } from "react-icons/md";
import { RiFeedbackLine } from "react-icons/ri";

const currentCourses = [
  { id: 1, name: "React for Beginners", progress: 75, category: "Frontend" },
  { id: 2, name: "DSA with Java", progress: 60, category: "Algorithms" },
  { id: 3, name: "System Design Basics", progress: 30, category: "Backend" },
];

const suggestedCourses = [
  { name: "JavaScript Deep Dive", reason: "Improve fundamentals" },
  { name: "MongoDB Advanced Operations", reason: "Expand database knowledge" },
  { name: "Scalable System Design Bootcamp", reason: "Complement current course" },
];

const OverviewCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className={`flex items-center gap-4 p-6 rounded-xl shadow-lg ${color} text-white`}
  >
    <div className="p-3 rounded-full bg-white bg-opacity-20">{icon}</div>
    <div>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </motion.div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-richblack-700 h-2.5 rounded-full mt-3">
    <div
      className="h-2.5 rounded-full bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8]"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-richblack-900 text-white px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] text-transparent bg-clip-text">
              Welcome Back, Student!
            </h1>
            <p className="text-richblack-300 mt-2">Here's your learning progress</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8] rounded-lg font-medium shadow-md"
          >
            View All Courses
          </motion.button>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <OverviewCard
            title="Quiz Avg. Score"
            value="72%"
            icon={<MdOutlineQuiz size={24} />}
            color="bg-gradient-to-br from-purple-600 to-blue-500"
          />
          <OverviewCard
            title="Enrolled Courses"
            value="3"
            icon={<MdSchool size={24} />}
            color="bg-gradient-to-br from-pink-600 to-rose-500"
          />
          <OverviewCard
            title="Feedbacks"
            value="5"
            icon={<RiFeedbackLine size={24} />}
            color="bg-gradient-to-br from-amber-600 to-yellow-500"
          />
          <OverviewCard
            title="Learning Streak"
            value="12 days"
            icon={<FaBookOpen size={24} />}
            color="bg-gradient-to-br from-emerald-600 to-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="p-2 rounded-lg bg-richblack-800">
                  <MdSchool className="text-blue-400" />
                </span>
                Current Courses
              </h2>
              <button className="text-blue-400 text-sm flex items-center gap-1 hover:underline">
                View all <FaChevronRight size={12} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5">
              {currentCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="bg-richblack-800 p-5 rounded-xl shadow-sm border border-richblack-700 hover:border-blue-500 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs px-2 py-1 rounded-full bg-richblack-700 text-blue-300">
                        {course.category}
                      </span>
                      <h3 className="text-lg font-semibold mt-2 text-white">{course.name}</h3>
                    </div>
                    <span className="text-blue-400 font-bold">{course.progress}%</span>
                  </div>
                  <ProgressBar progress={course.progress} />
                  <div className="flex justify-between mt-3 text-xs text-richblack-400">
                    <span>Last accessed: 2 days ago</span>
                    <button className="text-blue-400 hover:underline">Continue</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggested Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="p-2 rounded-lg bg-richblack-800">
                  <FaStar className="text-amber-400" />
                </span>
                Recommendations
              </h2>
            </div>
            
            <div className="bg-richblack-800 p-5 rounded-xl border border-richblack-700 shadow">
              <h3 className="font-medium text-white mb-4">Suggested to Improve</h3>
              <div className="space-y-4">
                {suggestedCourses.map((course, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-richblack-700 transition-colors"
                  >
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-400"></div>
                    <div>
                      <h4 className="font-medium text-white">{course.name}</h4>
                      <p className="text-sm text-richblack-400">{course.reason}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm bg-richblack-700 hover:bg-richblack-600 rounded-lg transition-colors">
                View All Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-10 bg-gradient-to-r from-richblack-800 to-richblack-700 p-6 rounded-xl border border-richblack-700 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500 bg-opacity-20">
              <FaChartLine className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Progress Summary</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Achievements</h3>
              <ul className="space-y-2 text-richblack-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Completed 5 React projects
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Scored 90% in last JavaScript quiz
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  12-day learning streak
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Next Steps</h3>
              <ul className="space-y-2 text-richblack-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Focus on JavaScript fundamentals
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Practice more DSA problems
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Hit 85% average in next quizzes
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-richblack-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-white">Weekly Goal</h3>
                <p className="text-sm text-richblack-400">Complete 3 chapters this week</p>
              </div>
              <div className="w-24 h-2 bg-richblack-700 rounded-full">
                <div className="h-2 rounded-full bg-gradient-to-r from-[#2EC4B6] to-[#38BDF8]" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;