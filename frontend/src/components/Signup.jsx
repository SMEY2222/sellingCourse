import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios'; 
// ១. នាំចូល useNavigate ពី react-router-dom
import { useNavigate } from 'react-router-dom'; 

const Signup = () => {
  // ២. បង្កើត variable navigate
  const navigate = useNavigate(); 
  
  const [showPass, setShowPass] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setErrorMessage(""); 
  
    try {
      const response = await axios.post("http://localhost:4001/api/v1/user/signup", {
        Firstname: firstName,
        Lastname: lastName,
        Email: email,
        Password: password,
      }, {
        withCredentials: true,
        headers: {
          "Content-type": "application/json",
        }
      });

      console.log("Signup Successful: ", response.data);
      toast.success("Signup Successful!");
      
   
      navigate('/login');
      
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.message || "Signup failed";
        setErrorMessage(msg);
        toast.error(msg);
      } else {
        console.error("Network/Server Error:", error);
        toast.error("Server is not responding.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] bg-gradient-to-br from-[#0a0f1c] via-[#070b14] to-[#0a0f1c] font-sans text-white relative flex items-center justify-center">
      
      {/* Navigation Header */}
      <nav className="absolute top-0 w-full flex justify-end items-center px-10 py-6 z-20 gap-4">
        <button 
          // ៤. ប្រើ navigate('/login') ជំនួស onSwitch
          onClick={() => navigate('/login')} 
          className="border border-slate-700 rounded-md px-5 py-2 text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          Login
        </button>
        <button className="px-5 py-2 bg-[#ff782d] rounded-md text-sm font-bold hover:bg-[#e66a25] transition-all shadow-lg">
          Join now
        </button>
      </nav>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-[#111827]/60 backdrop-blur-md rounded-xl p-10 border border-slate-800 shadow-2xl mt-16"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Welcome to <span className="text-[#ff782d]">EduVist</span>
          </h1>
          <p className="text-slate-400 text-sm italic">Just Signup To Join Us!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <p className="text-red-500 text-[11px] text-center font-bold bg-red-500/10 py-2 rounded italic">
              {errorMessage}
            </p>
          )}

          <div className="space-y-1.5">
            <label className="block text-slate-400 text-xs ml-1 font-medium">Firstname</label>
            <input 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              type="text" placeholder="Type your name" required
              className="w-full px-4 py-3 rounded-lg bg-[#1e293b]/40 border border-slate-700 text-white placeholder-slate-600 focus:border-[#ff782d] outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 text-xs ml-1 font-medium">Lastname</label>
            <input 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              type="text" placeholder="Type your name" required
              className="w-full px-4 py-3 rounded-lg bg-[#1e293b]/40 border border-slate-700 text-white placeholder-slate-600 focus:border-[#ff782d] outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 text-xs ml-1 font-medium">Email</label>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="name@email.com" required
              className="w-full px-4 py-3 rounded-lg bg-[#1e293b]/40 border border-slate-700 text-white placeholder-slate-600 focus:border-[#ff782d] outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-slate-400 text-xs ml-1 font-medium">Password</label>
            <div className="relative">
              <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                placeholder="********" required
                className="w-full px-4 py-3 rounded-lg bg-[#1e293b]/40 border border-slate-700 text-white placeholder-slate-600 focus:border-[#ff782d] outline-none transition-all pr-12 text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#ff782d] transition-colors"
              >
                {showPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <motion.button    
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-[#ff782d] text-white font-bold rounded-lg shadow-lg hover:bg-[#e66a25] transition-all text-sm mt-4 uppercase tracking-widest"
          >
            Signup
          </motion.button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-8 font-medium">
          Already have an account? 
          <button 
            // ៥. ប្រើ navigate('/login') ត្រង់នេះដែរ
            onClick={() => navigate('/login')} 
            className="ml-1.5 text-[#ff782d] font-bold hover:underline transition-all"
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
