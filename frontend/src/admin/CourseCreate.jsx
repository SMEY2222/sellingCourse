import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FaCloudUploadAlt, FaArrowLeft, FaBook, FaDollarSign } from 'react-icons/fa';
import { motion } from 'framer-motion';

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    const adminData = JSON.parse(localStorage.getItem("admin"));
    const token = adminData?.token;

    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/courses/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true,
        }
      );
      
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      const errorMsg = error.response?.data?.errors || error.response?.data?.message || "Failed to create course";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] bg-gradient-to-br from-[#0f172a] via-[#070b14] to-[#0f172a] text-white p-6 font-sans">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-bold">Create New <span className="text-orange-500">Course</span></h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Admin Management</p>
        </div>
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-[#111827]/60 backdrop-blur-xl rounded-2xl p-10 border border-slate-800 shadow-2xl"
      >
        <form onSubmit={handleCreateCourse} className="space-y-6">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <FaBook className="text-orange-500" /> Course Title
            </label>
            <input
              type="text"
              placeholder="e.g. Master React in 30 Days"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="block text-slate-300 text-sm font-semibold">Description</label>
            <textarea
              placeholder="Provide a detailed overview of the course content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-600 focus:border-orange-500 outline-none transition-all text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                <FaDollarSign className="text-orange-500" /> Price (USD)
              </label>
              <input
                type="number"
                placeholder="49.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-orange-500 outline-none transition-all text-sm"
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                <FaCloudUploadAlt className="text-orange-500" /> Thumbnail
              </label>
              <label className="flex flex-col items-center justify-center w-full h-[46px] border border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all">
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                    {image ? image.name : "Select Image File"}
                </span>
                <input type="file" onChange={changePhotoHandler} required className="hidden" />
              </label>
            </div>
          </div>

          {/* Image Preview Window */}
          {imagePreview && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-2xl overflow-hidden border border-orange-500/20 h-48 w-full relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] to-transparent opacity-60"></div>
                <p className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-widest text-orange-400">Thumbnail Preview</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-4 ${loading ? 'bg-slate-700' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold rounded-xl shadow-xl transition-all uppercase tracking-widest text-sm mt-4`}
          >
            {loading ? "Publishing..." : "Create Course"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default CourseCreate;
