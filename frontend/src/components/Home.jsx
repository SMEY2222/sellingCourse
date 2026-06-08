import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { CgMail } from "react-icons/cg";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import SliderOrigin from "react-slick";

const Slider = SliderOrigin.default ? SliderOrigin.default : SliderOrigin;

// ១. ដាក់ settings នៅទីនេះ (ខាងក្រៅ Home function)
const settings = {
  dots: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 2000,
  cssEase: "linear",
};

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // State to track the current slide index
console.log("Courses:", courses);
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/user/logout",
        {}, // 1. Add this empty object (request body)
        { withCredentials: true }, // 2. This is the config object
      );

      // 3. Remove the extra (await) and use response.data directly
      toast.success(response.data.message || "Logged out successfully");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error logging out:", error);
      // 4. Use optional chaining (?.) to prevent crashes if the error is empty
      toast.error(
        error.response?.data?.errors || "Failed to log out. Please try again.",
      );
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/v1/courses/Courses",
          {
            withCredentials: true, // បញ្ជាក់ថាត្រូវការបញ្ជូន cookies ជាមួយនឹងសំណើនេះ
          },
        );
        // ២. យកទិន្នន័យពី response.data ទៅដាក់ក្នុង State
        console.log(response.data); // បង្ហាញទិន្នន័យក្នុង console ដើម្បីពិនិត្យ
        setCourses(response.data.courses); // បង្កើត State ដើម្បីទុកទិន្នន័យ
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-screen  text-white container mx-auto ">
        {/*===================================================== Header -===================================================== */}
        <header className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-3">
            <img
              src="./logo.webp"
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <h1 className="text-2xl text-orange-500 font-bold tracking-tight">
              EduVist
            </h1>
          </div>

          <div className="flex gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-6 rounded hover:bg-blue-400 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login">
                  <button className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600 transition duration-300">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-orange-500 text-white py-2 px-6 rounded hover:bg-orange-600 transition duration-300">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* =====================================================Main section===================================================== */}
        <section className="flex-grow flex flex-col items-center justify-center px-10 py-20 text-center">
          <section className="max-w-3xl mx-auto flex flex-col items-center">
           
            <h2 className="text-6xl md:text-7xl font-extrabold mb-8 tracking-tighter text-orange-500 leading-[1.1]">
              EduVist
            </h2>
            <br />

   
            <p className="text-xl text-slate-300 mb-12 leading-relaxed font-medium max-w-xl">
              Sharpen your skills with courses crafted by experts.
            </p>

          
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/courses">
                <button className="bg-green-500 text-black font-bold py-3 px-10 rounded-md hover:bg-green-600 transition duration-300 shadow-lg shadow-green-500/20">
                  Get Started
                </button>
              </Link>
              <Link to="/about">
                <button className="bg-red-400 text-black font-bold py-3 px-10 rounded-md hover:bg-red-600 transition duration-300">
                  Learn More
                </button>
              </Link>
            </div>
            <section></section>
          </section>
        </section>
        {/* Auto scroll */}
        <section>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="relative flex-shrink-0 transition-transform duration-300 transform hover:scale-105">
                  <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                    <img
                      className="h-64 w-full object-cover"
                      src={course.image.url}
                      alt={course.title}
                    />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white mb-4">
                        {course.title}
                      </h2>
                      <button className="mt-2 bg-blue-500 text-white py-2.5 px-6 rounded-md hover:bg-orange-600 transition-colors duration-600">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr />
        {/* ===================================Footer============================= */}
        <footer className="my-10 ">
          <div className="grid grid-cols-1 md:grid-cols-3 ">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center space-x-3">
                <img
                  src="./logo.webp"
                  alt="Logo"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <h1 className="text-2xl text-orange-500 font-bold tracking-tight">
                  EduVist
                </h1>
              </div>

              <div className="mt-3 ml-5">
                <p className="mb-4">Follow Us</p>
                <div className="flex space-x-4 ">
                  <a href="">
                    <FaFacebook className="text-2xl hover:text-blue-500 transition duration-300" />
                  </a>
                  <a href="">
                    <FaTelegram className="text-2xl hover:text-blue-400 transition duration-300" />
                  </a>
                  <a href="">
                    <CgMail className="text-2xl hover:text-red-500 transition duration-300" />
                  </a>
                </div>
              </div>
            </div>
            {/* ផ្នែកកណ្ដាល (Center) - Connects */}
            <div className="flex flex-col items-center md:items-start mt-10 md:mt-0">
              <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-white">
                Connects
              </h4>
              <ul className="flex flex-col gap-4 text-slate-400 font-medium text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Youtube - Learn Coding
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Telegram - Learn Coding
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Github - Learn Coding
                  </a>
                </li>
              </ul>
            </div>

            {/* ផ្នែកខាងស្ដាំ (Right) - Copyrights & Policies */}
            <div className="flex flex-col items-center md:items-start mt-10 md:mt-0">
              <h4 className="text-lg font-bold mb-4 text-white">
                Copyrights © 2026 EduVist. All rights reserved.
              </h4>
              <ul className="flex flex-col gap-4 text-slate-400 font-medium text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Refund & Cancellation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
