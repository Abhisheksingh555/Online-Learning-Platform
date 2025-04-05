import { useState, useEffect } from 'react';

const StudentDashboard = () => {
  // State for dummy LMS data
  const [studentData, setStudentData] = useState({
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    enrolledCourses: [],
    recentActivities: [],
    upcomingAssignments: [],
    courseProgress: {},
    notifications: []
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  // Simulate API fetch with LMS dummy data
  useEffect(() => {
    const fetchDummyData = () => {
      setTimeout(() => {
        setStudentData({
          ...studentData,
          enrolledCourses: [
            { 
              id: 1, 
              title: 'Web Development Fundamentals', 
              instructor: 'Sarah Miller', 
              thumbnail: 'https://source.unsplash.com/random/300x200/?web,development', 
              lastAccessed: '2 days ago',
              completion: 65,
              nextLesson: 'JavaScript Functions'
            },
            { 
              id: 2, 
              title: 'Data Science Essentials', 
              instructor: 'Dr. Raj Patel', 
              thumbnail: 'https://source.unsplash.com/random/300x200/?data,science', 
              lastAccessed: '1 week ago',
              completion: 42,
              nextLesson: 'Pandas DataFrames'
            },
            { 
              id: 3, 
              title: 'UX/UI Design Principles', 
              instructor: 'Emma Wilson', 
              thumbnail: 'https://source.unsplash.com/random/300x200/?design,ui', 
              lastAccessed: '3 days ago',
              completion: 88,
              nextLesson: 'Prototyping Tools'
            },
          ],
          recentActivities: [
            { 
              id: 1, 
              type: 'assignment', 
              course: 'Web Development', 
              title: 'Submitted HTML/CSS Project', 
              time: '5 hours ago',
              icon: '📝'
            },
            { 
              id: 2, 
              type: 'discussion', 
              course: 'Data Science', 
              title: 'Replied to forum post', 
              time: '1 day ago',
              icon: '💬'
            },
            { 
              id: 3, 
              type: 'completion', 
              course: 'UX/UI Design', 
              title: 'Completed Module 3', 
              time: '2 days ago',
              icon: '✅'
            },
          ],
          upcomingAssignments: [
            { 
              id: 1, 
              course: 'Web Development', 
              title: 'JavaScript Exercises', 
              dueDate: '2023-09-15',
              status: 'pending'
            },
            { 
              id: 2, 
              course: 'Data Science', 
              title: 'Data Cleaning Project', 
              dueDate: '2023-09-18',
              status: 'pending'
            },
            { 
              id: 3, 
              course: 'UX/UI Design', 
              title: 'Wireframe Submission', 
              dueDate: '2023-09-12',
              status: 'urgent'
            },
          ],
          courseProgress: {
            'Web Development': { completed: 13, total: 20 },
            'Data Science': { completed: 8, total: 19 },
            'UX/UI Design': { completed: 17, total: 19 }
          },
          notifications: [
            { id: 1, message: 'New feedback on your project', read: false },
            { id: 2, message: 'Live Q&A session tomorrow', read: false },
            { id: 3, message: 'Course materials updated', read: true },
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchDummyData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">LearnHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Notifications</span>
                <div className="relative">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
                </div>
              </button>
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full" src={studentData.avatar} alt="User avatar" />
                <span className="ml-2 text-sm font-medium text-gray-700">{studentData.name}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Banner */}
        <div className="bg-indigo-600 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back, {studentData.name}!</h2>
              <p className="text-indigo-100 mt-1">Continue your learning journey</p>
            </div>
            <button className="mt-4 md:mt-0 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition duration-150">
              View Learning Path
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('courses')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              My Courses
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'progress' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Learning Progress
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'resources' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Resources
            </button>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enrolled Courses */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Enrolled Courses</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {studentData.enrolledCourses.map((course) => (
                  <div key={course.id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img className="h-32 w-full md:w-48 rounded-lg object-cover" src={course.thumbnail} alt={course.title} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{course.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {course.completion}% Complete
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">Instructor: {course.instructor}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${course.completion}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Last accessed {course.lastAccessed}
                          </div>
                          <div className="mt-2 md:mt-0">
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              Continue Learning
                            </button>
                          </div>
                        </div>
                        {course.nextLesson && (
                          <div className="mt-3 text-sm">
                            <span className="text-gray-500">Next: </span>
                            <span className="font-medium text-indigo-600">{course.nextLesson}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Activities</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {studentData.recentActivities.map((activity) => (
                  <div key={activity.id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex">
                      <div className="flex-shrink-0 text-2xl mr-4">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                        <p className="text-sm text-gray-500">{activity.course}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Assignments */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Assignments</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {studentData.upcomingAssignments.map((assignment) => (
                  <div key={assignment.id} className="p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{assignment.title}</p>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${assignment.status === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Progress */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Course Progress</h2>
              </div>
              <div className="p-6">
                {Object.entries(studentData.courseProgress).map(([course, progress]) => (
                  <div key={course} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{course}</span>
                      <span className="text-gray-600">{progress.completed}/{progress.total} lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {studentData.notifications.map((notification) => (
                  <div key={notification.id} className={`p-6 hover:bg-gray-50 transition duration-150 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <div className="flex">
                      <div className={`flex-shrink-0 h-2 w-2 mt-1 mr-3 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">Just now</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;