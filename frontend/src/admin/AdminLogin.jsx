import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    try {
      const response = await axios.post(
        `http://localhost:4001/api/v1/admin/login`, 
        {
          Email: email,    
          Password: password, 
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AdminLogin successful: ", response.data);
      toast.success(response.data.message || "Login Successful!");
          navigate("/admin/dashboard");
      

      localStorage.setItem("admin", JSON.stringify(response.data));
  

    } catch (error) {
      // 4. Improved error catching
      const msg = error.response?.data?.errors || error.response?.data?.message || "Login failed!";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
      <div className="h-screen container mx-auto flex items-center justify-center text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
           <img src="/logo.webp" alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-orange-500">
              CourseHaven
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/admin/signup"}
              className="bg-transparent border border-gray-500 py-2 px-4 rounded-md hover:bg-gray-800 transition"
            >
              Signup
            </Link>
            <Link
              to={"/courses"}
              className="bg-orange-500 py-2 px-4 rounded-md hover:bg-orange-600 transition"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* AdminLogin Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] mt-20 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-6 italic">
            Log in to access admin dashboard!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 mb-2 text-sm font-medium">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                placeholder="admin@email.com"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-400 mb-2 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                placeholder="********"
                required
              />
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-500 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-md transition uppercase tracking-widest shadow-lg"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-gray-500 hover:text-orange-400 transition">
              Are you a student? Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
