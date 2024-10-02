import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Sun, Moon, Search } from "lucide-react";

export default function CollegeManagementSystem() {
  const [activeTab, setActiveTab] = useState("students");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("theme");
    return savedMode ? savedMode === "dark" : true;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [courses, setCourses] = useState(() => {
    const savedCourses = localStorage.getItem("courses");
    return savedCourses ? JSON.parse(savedCourses) : [];
  });
  const [faculty, setFaculty] = useState(() => {
    const savedFaculty = localStorage.getItem("faculty");
    return savedFaculty ? JSON.parse(savedFaculty) : [];
  });

  // State for adding new items
  const [newStudent, setNewStudent] = useState({ name: "", course: "" });
  const [newCourse, setNewCourse] = useState({ name: "", faculty: "" });
  const [newFaculty, setNewFaculty] = useState({ name: "", department: "" });

  // Edit functionality
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  // Update local storage whenever the data changes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("faculty", JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleSearch = (list) => {
    return list.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const validateStudent = () => {
    return newStudent.name && newStudent.course;
  };

  const validateCourse = () => {
    return newCourse.name && newCourse.faculty;
  };

  const validateFaculty = () => {
    return newFaculty.name && newFaculty.department;
  };

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type); // Set the alert type
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000); // Clear alert after 3 seconds
  };

  const addOrEditStudent = () => {
    if (!validateStudent()) {
      showAlert("Please fill in all fields for student.", "error");
      return;
    }
    if (editMode && currentItem) {
      setStudents(
        students.map((student) =>
          student.id === currentItem.id
            ? { ...currentItem, ...newStudent }
            : student
        )
      );
      showAlert("Student updated successfully!", "success");
      setEditMode(false);
    } else {
      setStudents([...students, { id: students.length + 1, ...newStudent }]);
      showAlert("Student added successfully!", "success");
    }
    setNewStudent({ name: "", course: "" });
    setCurrentItem(null);
  };

  const addOrEditCourse = () => {
    if (!validateCourse()) {
      showAlert("Please fill in all fields for course.", "error");
      return;
    }
    if (editMode && currentItem) {
      setCourses(
        courses.map((course) =>
          course.id === currentItem.id
            ? { ...currentItem, ...newCourse }
            : course
        )
      );
      showAlert("Course updated successfully!", "success");
      setEditMode(false);
    } else {
      setCourses([...courses, { id: courses.length + 1, ...newCourse }]);
      showAlert("Course added successfully!", "success");
    }
    setNewCourse({ name: "", faculty: "" });
    setCurrentItem(null);
  };

  const addOrEditFaculty = () => {
    if (!validateFaculty()) {
      showAlert("Please fill in all fields for faculty.", "error");
      return;
    }
    if (editMode && currentItem) {
      setFaculty(
        faculty.map((f) =>
          f.id === currentItem.id ? { ...currentItem, ...newFaculty } : f
        )
      );
      showAlert("Faculty updated successfully!", "success");
      setEditMode(false);
    } else {
      setFaculty([...faculty, { id: faculty.length + 1, ...newFaculty }]);
      showAlert("Faculty added successfully!", "success");
    }
    setNewFaculty({ name: "", department: "" });
    setCurrentItem(null);
  };

  const deleteItem = (id, listSetter, list) => {
    listSetter(list.filter((item) => item.id !== id));
    showAlert("Item deleted successfully!", "success");
  };

  const editItem = (item, setter, setEdit) => {
    setter(item);
    setEdit(true);
    setCurrentItem(item);
  };

  const exportToCSV = (list) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      list.map((e) => Object.values(e).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div
        className={`min-h-screen bg-red-200 dark:bg-gray-900 transition-colors duration-300 ease-in-out text-gray-800 dark:text-gray-200`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center px-4 py-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mx-auto my-3 text-gray-800 dark:text-gray-200 tracking-wide">
            College Management System
          </h1>

          <button
            className="bg-gray-300 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-400 dark:hover:bg-gray-600"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={25} /> : <Moon size={25} />}
          </button>
        </div>

        {/* Alert Message */}
        {alertMessage && (
          <div
            className={`fixed top-5 right-5 p-3 rounded-lg mb-4 text-center transition-all duration-300 shadow-md ${
              alertType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {alertMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="container mx-auto px-2">
          <div className="bg-lime-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b">
              {["students", "courses", "faculty"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="p-4">
              <div className="flex items-center bg-slate-300 dark:bg-gray-700 rounded-lg px-4 py-2">
                <Search
                  size={20}
                  className="text-black dark:text-gray-300 mr-2"
                />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full bg-transparent outline-none text-black dark:text-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Dashboard Overview */}
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">
                  Dashboard Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-300 dark:bg-gray-700 p-4 rounded-md flex flex-col justify-center items-center">
                    <h3 className="font-semibold text-lg">Total Students</h3>
                    <p className="text-2xl">{students.length}</p>
                  </div>
                  <div className="bg-slate-300 dark:bg-gray-700 p-4 rounded-md flex flex-col justify-center items-center">
                    <h3 className="font-semibold text-lg">Total Courses</h3>
                    <p className="text-2xl">{courses.length}</p>
                  </div>
                  <div className="bg-slate-300 dark:bg-gray-700 p-4 rounded-md flex flex-col justify-center items-center">
                    <h3 className="font-semibold text-lg">Total Faculty</h3>
                    <p className="text-2xl">{faculty.length}</p>
                  </div>
                </div>
              </div>

              {/* Students Tab */}
              {activeTab === "students" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Add Students</h2>
                  <div className="flex flex-col mb-6 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                    <input
                      type="text"
                      placeholder="Student Name"
                      className="flex-1 p-2 border rounded-md bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Course"
                      className="flex-1 p-2 border rounded-md bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      value={newStudent.course}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, course: e.target.value })
                      }
                    />
                    <button
                      className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                      onClick={addOrEditStudent}
                    >
                      {editMode ? "Update Student" : "Add Student"}
                    </button>
                  </div>

                  <button
                    className="bg-green-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-green-600"
                    onClick={() => exportToCSV(students)}
                  >
                    Export Students to CSV
                  </button>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border ">
                      <thead>
                        <tr className="bg-gray-300 dark:bg-gray-700">
                          <th className="border   border-black  dark:border-white px-0 py-2">
                            Student Name
                          </th>
                          <th className="border  border-black  dark:border-white px-0 py-2">
                            Course
                          </th>
                          <th className="border border-black  dark:border-white px-0 py-2">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {handleSearch(students).map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <td className="border  border-black  dark:border-white px-4 py-2">
                              {item.name}
                            </td>
                            <td className="border  border-black  dark:border-white px-4 py-2">
                              {item.course}
                            </td>
                            <td className="border  border-b-neutral-800 dark:border-b-neutral  px-4 py-3 flex justify-center">
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() =>
                                  editItem(item, setNewStudent, setEditMode)
                                }
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 ml-4"
                                onClick={() =>
                                  deleteItem(item.id, setStudents, students)
                                }
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Courses Tab */}
              {activeTab === "courses" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Add Courses</h2>
                  <div className="flex flex-col mb-6 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                    <input
                      type="text"
                      placeholder="Course Name"
                      className="flex-1 p-2 border rounded-md bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Faculty"
                      className="flex-1 p-2 border rounded-md bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      value={newCourse.faculty}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, faculty: e.target.value })
                      }
                    />
                    <button
                      className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                      onClick={addOrEditCourse}
                    >
                      {editMode ? "Update Course" : "Add Course"}
                    </button>
                  </div>

                  <button
                    className="bg-green-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-green-600"
                    onClick={() => exportToCSV(courses)}
                  >
                    Export Courses to CSV
                  </button>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-300 dark:bg-gray-700">
                          <th className="border  border-black  dark:border-white px-0 py-2">
                            Course Name
                          </th>
                          <th className="border  border-black  dark:border-white px-0 py-2">
                            Faculty
                          </th>
                          <th className="border  border-black  dark:border-white px-0 py-2">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {handleSearch(courses).map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <td className="border  border-black  dark:border-white px-4 py-2">
                              {item.name}
                            </td>
                            <td className="border  border-black  dark:border-white px-4 py-2">
                              {item.faculty}
                            </td>
                            <td className="border   border-b-neutral-800 dark:border-b-neutral  px-4 py-3 flex justify-center">
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() =>
                                  editItem(item, setNewCourse, setEditMode)
                                }
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 ml-4"
                                onClick={() =>
                                  deleteItem(item.id, setCourses, courses)
                                }
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Faculty Tab */}
              {activeTab === "faculty" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Add Faculty</h2>
                  <div className="flex flex-col mb-6 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                    <input
                      type="text"
                      placeholder="Faculty Name"
                      className="flex-1 p-2 border rounded-md bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      value={newFaculty.name}
                      onChange={(e) =>
                        setNewFaculty({ ...newFaculty, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Department"
                      className="flex-1 p-2 border rounded-md bg-slate-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      value={newFaculty.department}
                      onChange={(e) =>
                        setNewFaculty({
                          ...newFaculty,
                          department: e.target.value,
                        })
                      }
                    />
                    <button
                      className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                      onClick={addOrEditFaculty}
                    >
                      {editMode ? "Update Faculty" : "Add Faculty"}
                    </button>
                  </div>

                  <button
                    className="bg-green-500 text-white rounded-md px-4 py-2 mb-4 hover:bg-green-600"
                    onClick={() => exportToCSV(faculty)}
                  >
                    Export Faculty to CSV
                  </button>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-300 dark:bg-gray-700">
                          <th className="border  border-black  dark:border-white px-0 py-2">
                            Faculty Name
                          </th>
                          <th className="border  border-black  dark:border-white px-0 py-2">
                            Department
                          </th>
                          <th className="border  border-black  dark:border-white px-0 py-2">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {handleSearch(faculty).map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <td className="border border-black  dark:border-white px-4 py-2">
                              {item.name}
                            </td>
                            <td className="border  border-black  dark:border-white px-4 py-2">
                              {item.department}
                            </td>
                            <td className="border  border-b-neutral-800  dark:border-b-neutral px-4 py-3 flex  justify-center">
                              <button
                                className="text-blue-500 hover:text-blue-700"
                                onClick={() =>
                                  editItem(item, setNewFaculty, setEditMode)
                                }
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 ml-4"
                                onClick={() =>
                                  deleteItem(item.id, setFaculty, faculty)
                                }
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
