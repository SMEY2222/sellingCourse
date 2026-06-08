import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload, FaSignOutAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { RiHome5Fill } from "react-icons/ri";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ១. ទាញយក Token ឱ្យបានត្រឹមត្រូវ
  const rawData = localStorage.getItem("user");
  let token = null;
  try {
    const authData = JSON.parse(rawData);
    token =
      typeof authData === "string"
        ? authData
        : authData?.token || authData?.user?.token;
  } catch (error) {
    token = rawData;
  }

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // ២. ទាញយកទិន្នន័យពី API
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4001/api/v1/user/purchases`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        );
        setPurchase(response.data.courses || []);
      } catch (error) {
        console.error("Fetch Error:", error);
        const errorMsg =
          error.response?.data?.error || "Failed to load purchases";
        toast.error(errorMsg);

        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed inset-y-0 left-0 bg-[#F8F9FA] border-r border-gray-100 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 w-64 z-50 flex flex-col`}
      >
        <div className="p-8 mb-4">
          <Link to="/">
            <div className="text-2xl text-orange-500 font-bold tracking-tight">
              <h1>EduVist</h1>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-6 space-y-7">
          <Link
            to="/"
            className={`flex items-center gap-4 transition-colors ${isActive("/") ? "text-blue-600" : "text-gray-800 hover:text-blue-600"}`}
          >
            <RiHome5Fill className="text-xl" />{" "}
            <span className="font-bold text-[15px]">Home</span>
          </Link>
          <Link
            to="/courses"
            className={`flex items-center gap-3 ${isActive("/courses") ? "text-blue-600" : "text-gray-600"}`}
          >
            <FaDiscourse /> <span className="text-sm font-medium">Courses</span>
          </Link>
          <Link
            to="/purchases"
            className={`flex items-center gap-3 ${isActive("/purchases") ? "text-blue-600" : "text-gray-600"}`}
          >
            <FaDownload />{" "}
            <span className="text-sm font-medium">Purchases</span>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-3 ${isActive("/settings") ? "text-blue-600" : "text-gray-600"}`}
          >
            <IoMdSettings />{" "}
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-600 w-full pt-4 text-left"
          >
            <FaSignOutAlt /> <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-gray-800">My Purchases</h1>
        </header>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.length > 0 ? (
              purchases.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow"
                >
                  {/* រូបភាព Course */}
                  <div className="h-40 w-full flex items-center justify-center mb-4">
                    <img
                      className="max-h-full max-w-[80%] object-contain"
                      src={course.image?.url}
                      alt={course.title}
                    />
                  </div>

                  {/* ព័ត៌មាន Course */}
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-[10px] leading-relaxed mb-2 line-clamp-2 px-2">
                    {course.description || "No description available."}
                  </p>
                  <p className="text-green-600 font-bold text-[11px] mb-6">
                    ${course.price || "0"} only
                  </p>

                  {/* ប៊ូតុងបញ្ជា */}
                  <div className="w-full space-y-2 mt-auto">
                    <button
                      onClick={() => navigate(`/course/view/${course._id}`)}
                      className="w-full bg-orange-500 text-white py-2.5 rounded-md text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/invoice/${course._id}`)}
                      className="w-full bg-[#E9ECEF] text-gray-700 py-2.5 rounded-md text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      View Invoice
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500">No purchases found.</p>
                <Link
                  to="/courses"
                  className="text-blue-600 text-sm underline mt-2 inline-block"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Purchases;
