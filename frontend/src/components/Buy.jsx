import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import { jwtDecode } from "jwt-decode"; 

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  // --- ការទាញយកព័ត៌មាន User ពី localStorage/Token ---
  const rawData = localStorage.getItem('user');
  let token = null; 
  let user = null; 

  try {
    if (rawData) {
      const authData = JSON.parse(rawData);
      // កំណត់យក user និង token ឱ្យច្បាស់លាស់
      user = authData?.user || authData;
      token = authData?.token || authData?.user?.token || (typeof authData === 'string' ? authData : null);
      
      // ប្រសិនបើជា JWT Token អាច decode បន្ថែម (បើចាំបាច់)
      if (token && token.startsWith('eyJ')) {
        const decoded = jwtDecode(token);
        // បញ្ចូលទិន្នន័យពី token ទៅក្នុង user object បើខ្វះ
        user = { ...user, ...decoded };
      }
    }
  } catch (error) {
    console.error("Error parsing user data", error);
  }

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/courses/${courseId}`);
        setCourse(response.data.course);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };
    if (courseId) fetchCourseDetails();
  }, [courseId]);

  const handlePurchase = async (event) => {
    if (event) event.preventDefault();

    if (!token) {
      toast.error('Please login to purchase the course');
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      setLoading(true);

      // ១. បង្កើត Client Secret ពី Backend
      const response = await axios.get(
        `${BACKEND_URL}/courses/buy/${courseId}`, 
        { 
          headers: { Authorization: `Bearer ${token}` }, 
          withCredentials: true 
        }
      );

      const { clientSecret } = response.data;

      // ២. បញ្ជាក់ការបង់ប្រាក់ជាមួយ Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.firstName || user?.name || "Customer", 
            email: user?.email || "customer@example.com", 
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
          
          // ៣. រៀបចំទិន្នន័យ (ប្រើ object 'user' ដែលយើងប្រកាសខាងលើ)
          const paymentInfo = {
            email: user?.email,
            userId: user?._id || user?.id, // ប្រើឈ្មោះ key ឱ្យត្រូវតាម model របស់អ្នក
            courseId: courseId,
            paymentId: result.paymentIntent.id,
            amount: result.paymentIntent.amount / 100,
            status: result.paymentIntent.status
          };

          console.log("Final PaymentInfo being sent to Backend: ", paymentInfo);

          try {
            // ៤. ផ្ញើទៅកាន់ Backend ឱ្យចំ Route /order/data
            await axios.post(`${BACKEND_URL}/order/data`, paymentInfo, {
              headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Payment Successful & Order Saved!");
            navigate("/purchases"); 
          } catch (dbError) {
            console.error("Database Error:", dbError);
            toast.error("Payment ok, but failed to save order data.");
          }
      }
      
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error(error.response?.data?.message || "Failed to process payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-10'>
      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        <div className="md:w-1/2 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
           <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white mb-12">
              <FaArrowLeft className="mr-2" /> Back
            </button>
           <div>
             <h1 className="text-4xl font-black mb-6 leading-tight">Master New Skills <br/><span className="text-orange-500">Today.</span></h1>
             <p className="text-slate-300 font-bold text-xl">{course?.title || "Loading course..."}</p>
           </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="text-center mb-10">
            <div className="inline-block p-5 bg-orange-50 rounded-full mb-4">
              <FaShoppingCart className="text-orange-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Checkout</h2>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
            <div className="space-y-3 mb-6">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-400">Total Amount</span>
                 <span className="text-3xl font-black text-orange-500">${course?.price || "0.00"}</span>
               </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl mb-6">
              <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770' } } }} />
            </div>
          </div>

          <button 
            disabled={loading || !course || !stripe}
            onClick={handlePurchase}
            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg hover:bg-orange-600 transition"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buy;
