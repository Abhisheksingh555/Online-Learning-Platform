import { useState, useEffect } from "react";

const courses = [
  { id: 1, name: "DSA in Java" },
  { id: 2, name: "Full Stack MERN" },
  { id: 3, name: "Machine Learning" },
];

const students = [
  { id: 1, name: "Abhishek Singh", email: "abhishek@example.com" },
  { id: 2, name: "Aryan Verma", email: "aryan@example.com" },
  { id: 3, name: "Priya Sharma", email: "priya@example.com" },
  { id: 4, name: "Priyaka Sharma", email: "priyaka@example.com" },
  { id: 5, name: "Priyan Sharma", email: "priyan@example.com" },
];

const AssignStudent = () => {
  const [activeTab, setActiveTab] = useState("remove");
  const [selectedCourse, setSelectedCourse] = useState("2");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  // ✅ Each student is assigned with a courseId
  const [assignedStudents, setAssignedStudents] = useState([
    {
      id: 1,
      name: "Abhishek Singh",
      email: "abhishek@example.com",
      courseId: "2",
    },
    {
      id: 2,
      name: "Aryan Verma",
      email: "aryan@example.com",
      courseId: "2",
    },
    {
      id: 3,
      name: "Priya Sharma",
      email: "priya@example.com",
      courseId: "2",
    },
    {
      id: 4,
      name: "Priyaka Sharma",
      email: "priyaka@example.com",
      courseId: "1",
    },
  ]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const studentsInCourse = assignedStudents.filter(
    (s) => s.courseId === selectedCourse
  );

  const handleAssign = () => {
    const student = students.find((s) => s.id.toString() === selectedStudent);
    if (
      student &&
      !assignedStudents.some(
        (s) => s.id === student.id && s.courseId === selectedCourse
      )
    ) {
      setAssignedStudents((prev) => [
        ...prev,
        { ...student, courseId: selectedCourse },
      ]);
      setSelectedStudent("");
      setSearchTerm("");
    }
  };

  const handleRemove = (studentId) => {
    setAssignedStudents((prev) =>
      prev.filter(
        (s) => !(s.id === studentId && s.courseId === selectedCourse)
      )
    );
  };

  useEffect(() => {
    if (!filteredStudents.find((s) => s.id.toString() === selectedStudent)) {
      setSelectedStudent("");
    }
  }, [searchTerm]);

  return (
    <div className="p-6 rounded-lg bg-richblack-800 min-h-[80vh] text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-yellow-400 mb-6 text-center">
        Assign Students to Course
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 justify-center">
        {["assign", "remove"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === tab
                ? "bg-yellow-400 text-richblack-900"
                : "bg-richblack-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Course Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 text-richblack-300">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full p-2 rounded bg-richblack-700 text-white"
        >
          <option value="">-- Choose Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Assign Tab */}
      {activeTab === "assign" && (
        <>
          <div className="mb-4">
            <label className="block mb-1 text-richblack-300">
              Search Student
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded bg-richblack-700 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-richblack-300">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 rounded bg-richblack-700 text-white"
            >
              <option value="">-- Choose Student --</option>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.email}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  No matching students
                </option>
              )}
            </select>
          </div>

          <button
            onClick={handleAssign}
            disabled={!selectedCourse || !selectedStudent}
            className="bg-yellow-400 px-4 py-2 rounded text-richblack-900 font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            Assign Student
          </button>
        </>
      )}

      {/* Remove Tab */}
      {activeTab === "remove" && (
        <div className="mt-4">
          {studentsInCourse.length === 0 ? (
            <p className="text-richblack-300">
              No students assigned to this course.
            </p>
          ) : (
            <table className="w-full text-left mt-4 border border-richblack-700">
              <thead>
                <tr className="bg-richblack-700 text-yellow-400">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {studentsInCourse.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-richblack-600"
                  >
                    <td className="py-2 px-3">{student.name}</td>
                    <td className="py-2 px-3">{student.email}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleRemove(student.id)}
                        className="text-red-400 hover:text-red-500 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignStudent;
