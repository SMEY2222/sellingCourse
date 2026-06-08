import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaBook, FaPlusCircle, FaHome, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

function Dashboard() {
  const navigate = useNavigate();

  // ១. បន្ថែមការការពារ Dashboard (បើអត់មាន Admin ក្នុង LocalStorage ឱ្យទៅទំព័រ Login)
  useEffect(() => {
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // ២. កែសម្រួលការហៅ axios.post ឱ្យត្រូវតាមទម្រង់ (URL, Data, Config)
      const response = await axios.post(
        `http://localhost:4001/api/v1/admin/logout`, 
        {}, // Parameter ទី២ គឺជា Body (ទុកទទេបើ Backend មិនទាមទារ)
        {
          withCredentials: true, // Parameter ទី៣ ទើបជាកន្លែងដាក់ Config
        }
      );

      toast.success(response.data.message || "Logged out successfully");
      
      // លុបទិន្នន័យចេញពី Local Storage និងប្តូរទៅទំព័រ Login
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } catch (error) {
      console.error("Error in logging out:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.errors || "Error in logging out";
      toast.error(errorMsg);
    }
  };

  // ៣. បង្ហាញ UI តែពេលមាន admin ក្នុង LocalStorage
  const admin = JSON.parse(localStorage.getItem("admin"));
  if (!admin) return null;

  const navItems = [
    { name: "Our Courses", path: "/admin/our-courses", icon: <FaBook />, color: "hover:bg-emerald-500/10 hover:text-emerald-400" },
    { name: "Create Course", path: "/admin/create-course", icon: <FaPlusCircle />, color: "hover:bg-orange-500/10 hover:text-orange-400" },
    { name: "Home", path: "/", icon: <FaHome />, color: "hover:bg-blue-500/10 hover:text-blue-400" },
  ];

  return (
    <div className="flex h-screen bg-[#070b14] text-white font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-[#111827] border-r border-slate-800 p-8 flex flex-col shadow-2xl">
        <div className="flex items-center flex-col mb-12">
          <div className="relative p-1 rounded-full bg-gradient-to-tr from-orange-500 to-indigo-500 mb-4">
            <img src="/logo.webp" alt="Logo" className="w-10 h-10 rounded-full" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Admin <span className="text-orange-500">Panel</span></h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1 font-bold">Authorized Access</p>
        </div>

        <nav className="flex flex-col space-y-3 flex-grow">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path}>
              <motion.button 
                whileHover={{ x: 5 }}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-400 transition-all duration-200 border border-transparent ${item.color} font-medium text-sm`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </motion.button>
            </Link>
          ))}
        </nav>

        {/* Logout at the bottom */}
        <div className="pt-6 border-t border-slate-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 font-bold text-sm border border-red-500/10"
            >
              <FaSignOutAlt /> Logout
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow relative overflow-hidden flex items-center justify-center">
        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <div className="mb-6 inline-flex p-4 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-xl">
             <FaUserShield className="text-5xl text-orange-500" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome back, <span className="text-indigo-500">Admin</span>!</h1>
          <p className="text-slate-500 max-w-sm mx-auto">
            Manage your courses, monitor analytics, and maintain the EduVist platform from this command center.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
