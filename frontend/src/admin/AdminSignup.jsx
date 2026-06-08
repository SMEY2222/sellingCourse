import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        `http://localhost:4001/api/v1/admin/signup`,
        {
    
          Firstname: firstName, 
          Lastname: lastName,
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
      
      console.log("Signup successful: ", response.data);
      toast.success(response.data.message || "Account created successfully!");
      navigate("/admin/login");
    } catch (error) {
      const msg = error.response?.data?.errors || error.response?.data?.message || "Signup failed!!!";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen">
      <div className="container mx-auto flex items-center justify-center text-white py-20">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-orange-500">
              CourseHaven
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/admin/login"}
              className="bg-transparent border border-gray-500 py-2 px-4 rounded-md hover:bg-gray-800 transition"
            >
              Login
            </Link>
            <Link
              to={"/courses"}
              className="bg-orange-500 py-2 px-4 rounded-md hover:bg-orange-600 transition"
            >
              Join now
            </Link>
          </div>
        </header>

        {/* AdminSignup Form */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[500px] border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-6 italic text-sm">
            Create an admin account to manage the dashboard!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1 text-xs">Firstname</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 text-xs">Lastname</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1 text-xs">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition"
                placeholder="admin@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 text-xs">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none transition"
                placeholder="********"
                required
              />
            </div>

            {errorMessage && (
              <div className="text-red-500 text-xs text-center bg-red-500/10 py-2 rounded border border-red-500/20">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md transition uppercase tracking-widest text-sm shadow-lg mt-2"
            >
              Create Admin Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
