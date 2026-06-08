import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FaTrash, FaEdit, FaArrowLeft, FaTag, FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ១. ទាញយក Token ពី LocalStorage
  const adminData = JSON.parse(localStorage.getItem("admin"));
  const token = adminData?.token;

  useEffect(() => {
    // ២. បើគ្មាន Token ឱ្យត្រឡប់ទៅ Login
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        // កែ URL: ថែមអក្សរ 's' ទៅលើ course -> courses ដើម្បីឱ្យត្រូវតាម Backend Route (router.get("/"))
        // អាសយដ្ឋានពេញគឺ៖ http://localhost:4001/api/v1/courses
        const response = await axios.get(`${BACKEND_URL}/courses`, {
          withCredentials: true,
        });
        
        // ឆែកទិន្នន័យដែលទទួលបានពី API (courses ជា Array)
        const data = response.data.courses || response.data;
        setCourses(Array.isArray(data) ? data : []);
        
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses. Make sure Backend is running.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token, navigate]);

  // ៣. មុខងារលុប Course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      // ប្រើ Path: /courses/delete/:id ឱ្យត្រូវតាម Router
      const response = await axios.delete(`${BACKEND_URL}/courses/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      toast.success(response.data.message || "Course deleted");
      setCourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error deleting course");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-6 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm mb-2"
          >
            <FaArrowLeft /> Dashboard
          </button>
          <h1 className="text-4xl font-black tracking-tight uppercase">Our <span className="text-orange-500">Courses</span></h1>
        </div>
        
        <Link
          to="/admin/create-course"
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 uppercase tracking-widest text-sm"
        >
          Add New Course
        </Link>
      </div>

      {/* បញ្ជីបង្ហាញ Course */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-4 text-slate-500 italic">Fetching library...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-[#111827]/40 rounded-3xl border border-dashed border-slate-800">
             <FaBookOpen className="mx-auto text-5xl text-slate-700 mb-4" />
             <p className="text-slate-500 italic">No courses found. Start by creating one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <motion.div 
                key={course._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111827]/60 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all flex flex-col group"
              >
          
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course?.image?.url || "/placeholder.jpg"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                     <span className="font-bold text-orange-400 text-sm">${course.price}</span>
                  </div>
                </div>

    
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold mb-3 line-clamp-1 uppercase tracking-tight">{course.title}</h2>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6">{course.description}</p>

             
                  <div className="mt-auto flex gap-3 pt-4 border-t border-slate-800">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all"
                    >
                      <FaTrash size={10} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OurCourses;
