import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaDiscourse, FaDownload } from "react-icons/fa6";
import { RiHome5Fill } from "react-icons/ri";
import { MdSettings, MdLogout, MdLibraryBooks } from "react-icons/md";
import { BsArrowRightShort } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:4001/api/v1/courses", { withCredentials: true });
        setCourses(data.courses || data || []);
      } catch (error) {
        toast.error("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4001/api/v1/user/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Server logout failed, clearing local session.");
    } finally {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#F0F4FF]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#F1F3F6] flex flex-col fixed h-full z-40 border-r border-gray-200">
        <div className="p-8 mb-4">
          <Link to="/">
            <div className="text-2xl text-orange-500 font-bold tracking-tight">
              <h1>EduVist</h1>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 px-8 space-y-7">
          <Link to="/" className={`flex items-center gap-4 transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}>
            <RiHome5Fill className="text-xl" /> <span className="font-bold text-[15px]">Home</span>
          </Link>
          <Link to="/courses" className={`flex items-center gap-4 transition-colors ${isActive('/courses') ? 'text-blue-600' : 'text-gray-800 hover:text-blue-600'}`}>
            <FaDiscourse className="text-xl" /> <span className="font-bold text-[15px]">Courses</span>
          </Link>
          <Link to="/purchases" className="flex items-center gap-4 text-gray-800 hover:text-blue-600 transition-colors">
            <FaDownload className="text-xl" /> <span className="font-bold text-[15px]">Purchases</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-4 text-gray-800 hover:text-blue-600 transition-colors">
            <MdSettings className="text-xl" /> <span className="font-bold text-[15px]">Settings</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-4 text-gray-800 hover:text-red-600 transition-colors w-full text-left">
            <MdLogout className="text-xl" /> <span className="font-bold text-[15px]">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">
        {/* HERO HEADER */}
        <section className="bg-gradient-to-br from-[#1E5CFF] to-[#0D38B1] p-16 relative overflow-hidden">
          <div className="absolute top-8 right-16 z-20">
            <div className="relative hidden md:block">
              <input type="text" placeholder="Type here to search..." className="pl-4 pr-10 py-2 bg-white/10 border border-white/20 rounded-full text-white text-xs w-64 focus:outline-none focus:bg-white/20 backdrop-blur-md placeholder:text-white/60 shadow-sm" />
              <FiSearch className="absolute right-3 top-2.5 text-white/60" />
            </div>
          </div>
          <div className="max-w-5xl relative z-10 pt-10">
            <h1 className="text-5xl font-bold text-white leading-tight mb-6 italic">Immerse Yourself in <span className="text-[#FFB800]">Digital Learning</span></h1>
            <button className="bg-white text-[#1E5CFF] px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#FFB800] hover:text-white transition-all shadow-xl">
               View Courses <BsArrowRightShort className="text-2xl" />
            </button>
          </div>
        </section>

        {/* COURSES GRID */}
        <div className="p-12">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-[#0A1633] flex items-center gap-3">
              <MdLibraryBooks className="text-blue-600" /> Featured Courses
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20 animate-pulse text-blue-600 font-bold italic">Syncing with server...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col group">
                  {/* Image Area - ចំកណ្តាលដូចរូប */}
                  <div className="h-48 bg-gray-50 rounded-2xl mb-5 overflow-hidden flex items-center justify-center p-6">
                    <img 
                      src={course.image?.url || "https://placeholder.com"} 
                      alt={course.title} 
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      onError={(e) => { e.target.src = "https://placeholder.com?text=Course"; }}
                    />
                  </div>
                  
                  {/* Content Area */}
                  <div className="flex-1 flex flex-col px-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{course.title}</h3>
                    <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed h-8">
                      {course.description || "Start your programming journey with our comprehensive masterclass today."}
                    </p>
                    
                    {/* Pricing Section (ដូចរូបគំរូ) */}
                    <div className="mt-auto flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-black text-xl">${course.price || "99"}</span>
                        <span className="text-gray-400 text-sm line-through decoration-1">5999</span>
                      </div>
                      <span className="text-green-500 font-bold text-xs">20% off</span>
                    </div>

                    {/* Buy Button */}
                    <button 
                      onClick={() => navigate(`/buy/${course._id}`)}
                      className="w-full bg-[#FF6B00] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#E66000] shadow-lg shadow-orange-200 transition-all active:scale-95 uppercase tracking-wider"
                    >
                     Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;
