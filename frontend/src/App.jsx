import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup"; // កែអក្ខរាវិរុទ្ធពី Signub -> Signup
import { Toaster } from "react-hot-toast";
import Courses from "./components/Courses";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";

import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import OurCourses from "./admin/OurCourses";
import UpdateCourse from "./admin/UpdateCourse";
import CourseCreate from "./admin/CourseCreate";

// បង្កើត Component សម្រាប់ការពារ Route (បើអត់ Login គឺចូលអត់បាន)
const ProtectedRoute = ({ children, role }) => {
  const auth = JSON.parse(localStorage.getItem(role));
  return auth ? children : <Navigate to={role === "admin" ? "/admin/login" : "/login"} />;
};

function App() {
  return (
    <div>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/purchases" element={<ProtectedRoute role="user"><Purchases /></ProtectedRoute>} />
        <Route path="/buy/:courseId" element={<ProtectedRoute role="user"><Buy /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* ប្រើ ProtectedRoute ដើម្បីការពារ Dashboard និងទំព័រ Admin ផ្សេងៗ */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/our-courses" element={<ProtectedRoute role="admin"><OurCourses /></ProtectedRoute>} />
        
        {/* កែឱ្យត្រូវនឹង Dashboard.jsx: /admin/create-course */}
        <Route path="/admin/create-course" element={<ProtectedRoute role="admin"><CourseCreate /></ProtectedRoute>} />
        
        <Route path="/admin/update-course/:id" element={<ProtectedRoute role="admin"><UpdateCourse /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
