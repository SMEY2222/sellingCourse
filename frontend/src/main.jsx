import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
const stripePromise = loadStripe("pk_test_51TfcptL3z4nyG2cJXm3kIjjbO8cTVdcSy5dV5nFmyVzkZetsfIxVu0wfgx2DztrMNrj2HNCYcJiKneJGicpLgn1X00wz42hiTq");
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import './index.css'

import App from './App.jsx'


createRoot(document.getElementById('root')).render(
   
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
)
