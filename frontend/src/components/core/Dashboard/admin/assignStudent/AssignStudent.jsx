import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

const AssignStudent = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    studentId: ''
  });
  const { token } = useSelector(state => state.auth);

  // Fetch all courses and students on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch courses
        const coursesResponse = await fetch(`/course/getAllCourses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.data);

        // Fetch students
        const studentsResponse = await fetch(`/admin/getAllStudents`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.studentId) {
      toast.error('Please select both course and student');
      return;
    }

    try {
      setLoading(true);
      const response = await (formData, token);
      if (response.success) {
        toast.success('Student enrolled successfully');
        // Refresh data or update state as needed
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast.error('Failed to enroll student');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.studentId) {
      toast.error('Please select both course and student');
      return;
    }

    try {
      setLoading(true);
      const response = await (formData, token);
      if (response.success) {
        toast.success('Student unenrolled successfully');
        // Refresh data or update state as needed
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error unenrolling student:', error);
      toast.error('Failed to unenroll student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-richblack-900 text-richblack-5 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Manage Student Enrollment</h1>
      
      <div className="bg-richblack-800 p-6 rounded-lg shadow-lg">
        <form className="space-y-4">
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium mb-2">
              Select Course
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-5"
              disabled={loading}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="studentId" className="block text-sm font-medium mb-2">
              Select Student
            </label>
            <select
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-richblack-700 border border-richblack-600 text-richblack-5"
              disabled={loading}
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName} ({student.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleEnroll}
              disabled={loading || !formData.courseId || !formData.studentId}
              className="flex-1 py-2 px-4 bg-yellow-50 text-richblack-900 rounded-lg font-medium hover:bg-yellow-25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Enroll Student'}
            </button>
            <button
              type="button"
              onClick={handleUnenroll}
              disabled={loading || !formData.courseId || !formData.studentId}
              className="flex-1 py-2 px-4 bg-pink-600 text-richblack-5 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Unenroll Student'}
            </button>
          </div>
        </form>
      </div>

      {/* Optional: Add a section to show enrolled students for selected course */}
    </div>
  );
};

export default AssignStudent;