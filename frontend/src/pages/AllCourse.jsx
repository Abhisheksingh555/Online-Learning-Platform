import  { useState, useEffect } from 'react';
import { FiBookOpen, } from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { courseEndpoints } from '../services/apis';

const AllCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(courseEndpoints.GET_ALL_COURSE_API);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setCourses(response.data.data);
        } else {
          throw new Error('Invalid course data format');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCardClick = (courseId, e) => {
    // Prevent navigation if click was on a button or its children
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/course/${courseId}`);
  };

  const handleEnrollClick = (course, e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: '/courses' } });
      return;
    }
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const confirmEnrollment = async () => {
    try {
      if (!selectedCourse) return;
      
      if (selectedCourse.price > 0) {
        navigate('/checkout', { state: { course: selectedCourse } });
      } else {
        const response = await axios.post(
          courseEndpoints.COURSE_PAYMENT_API,
          { courses: [selectedCourse._id] },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        
        if (response.data.success) {
          setShowEnrollModal(false);
          navigate(`/course/${selectedCourse._id}`);
        }
      }
    } catch (err) {
      console.error('Enrollment failed:', err);
      setError('Enrollment failed. Please try again.');
      setShowEnrollModal(false);
    }
  };

  const renderRatingStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-70" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto my-5 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Explore Our Courses</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master new skills with our expert-led courses. Start your learning journey today!
          </p>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <h3 className="text-xl font-medium text-gray-700 mb-2">No courses available</h3>
            <p className="text-gray-500">Check back later for new course offerings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course._id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                onClick={(e) => handleCardClick(course._id, e)}
              >
                <div className="relative">
                  <img 
                    src={course.thumbnail} 
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                    alt={course.courseName}
                    onError={(e) => {
                      e.target.src = '/default-course.jpg';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {course.studentsEnrolled?.length || 0} Enrolled
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {course.courseName}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap">
                      {course.price > 0 ? `₹${course.price}` : 'FREE'}
                    </span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderRatingStars(4.5)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({course.ratingAndReviews?.length || 0} reviews)
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.courseDescription}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <img 
                      src={course.instructor.image} 
                      className="w-8 h-8 rounded-full mr-2"
                      alt={course.instructor.firstName}
                    />
                    <span className="text-sm text-gray-700">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => handleEnrollClick(course, e)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    <FiBookOpen className="mr-2" />
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment Confirmation Modal */}
      {showEnrollModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Confirm Enrollment
                </h3>
                <button 
                  onClick={() => setShowEnrollModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <img 
                    src={selectedCourse.thumbnail} 
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                    alt={selectedCourse.courseName}
                  />
                  <div>
                    <h4 className="text-lg font-semibold">
                      {selectedCourse.courseName}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {selectedCourse.instructor.firstName} {selectedCourse.instructor.lastName}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price:</span>
                    <span className={`font-bold ${
                      selectedCourse.price > 0 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {selectedCourse.price > 0 ? `₹${selectedCourse.price}` : 'FREE'}
                    </span>
                  </div>
                  {selectedCourse.price > 0 && (
                    <p className="text-sm text-gray-500">
                      This amount will be charged to your account
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnrollment}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 font-medium"
              >
                {selectedCourse.price > 0 ? 'Proceed to Payment' : 'Confirm Enrollment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCourse;