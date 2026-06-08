import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import { FaSave, FaArrowLeft, FaBook, FaDollarSign, FaCloudUploadAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/${id}`, {
          withCredentials: true,
        });
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImagePreview(data.course.image.url);
        // We don't set 'image' state here because it's a string URL, 
        // and our update logic expects a File object if changed.
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch course data");
        navigate("/admin/our-courses");
      }
    };
    fetchCourseData();
  }, [id, navigate]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    
    // Only append if a NEW image file was selected
    if (image instanceof File) {
      formData.append("image", image); 
    }

    const adminData = JSON.parse(localStorage.getItem("admin"));
    const token = adminData?.token;

    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 italic">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] bg-gradient-to-br from-[#0f172a] via-[#070b14] to-[#0f172a] text-white p-6 font-sans">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate('/admin/our-courses')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-sm"
        >
          <FaArrowLeft /> Back to Courses
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-bold">Update <span className="text-orange-500">Course</span></h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">ID: {id.slice(-6)}</p>
        </div>
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-[#111827]/60 backdrop-blur-xl rounded-2xl p-10 border border-slate-800 shadow-2xl"
      >
        <form onSubmit={handleUpdateCourse} className="space-y-6">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <FaBook className="text-orange-500" /> Course Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-orange-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-slate-300 text-sm font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-orange-500 outline-none transition-all text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                <FaDollarSign className="text-orange-500" /> Price (USD)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-orange-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                <FaCloudUploadAlt className="text-orange-500" /> Update Thumbnail
              </label>
              <label className="flex flex-col items-center justify-center w-full h-[46px] border border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-all">
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">
                    {image instanceof File ? image.name : "Keep Current Image"}
                </span>
                <input type="file" onChange={changePhotoHandler} className="hidden" />
              </label>
            </div>
          </div>

          {/* Current/Preview Image */}
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-800 h-48 w-full relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] to-transparent opacity-60"></div>
              <p className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Thumbnail</p>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={updating}
            className={`w-full py-4 ${updating ? 'bg-slate-700' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold rounded-xl shadow-xl transition-all uppercase tracking-widest text-sm mt-4 flex items-center justify-center gap-2`}
          >
            <FaSave /> {updating ? "Saving Changes..." : "Update Course"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default UpdateCourse;
