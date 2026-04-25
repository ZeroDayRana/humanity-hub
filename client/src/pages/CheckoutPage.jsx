import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Checkout = () => {

  const location = useLocation(); // Get the location object
  // ✅ Get both amount and campaign
  const { campaign, amount } = location.state || {}; // Extract campaign and amount from state or default to empty object
  const campaignId = campaign?.id;
  const navigate = useNavigate();

  const hasRun = useRef(false);

  useEffect(() => {
    // ✅ Validate both
    if (!amount || !campaignId || hasRun.current) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to make a donation");
      navigate("/login", { replace: true });
      return;
    }

    hasRun.current = true;

    const startPayment = async () => {
      try {
        const response = await axios.post(`${SERVER_URL}/api/donations`, {
          amount,
          campaignId // 🔥 SEND THIS TO BACKEND
        }, {
          headers: token ? {
            Authorization: `Bearer ${token}`
          } : {}
        });

        console.log(response.data.sessionId);

        const paymentSessionId = response.data.sessionId;

        if (!paymentSessionId) {
          alert("Payment session not created!");
          return;
        }

        // Initialize Cashfree
        const cashfree = window.Cashfree?.({
          mode: "sandbox",
        });

        if (!cashfree) {
          alert("Cashfree SDK not loaded");
          return;
        }

        // Open Cashfree checkout
        cashfree.checkout({
          paymentSessionId,
          redirectTarget: "_self"
        });

      } catch (error) {
        alert("Error creating payment session. Check console.");
        console.error(error);
      }
    };

    startPayment();

  }, [amount, campaignId]);

  // ❗ Handle invalid cases
  if (!amount || !campaignId) {
    return <h1>Invalid payment request</h1>;
  }

  return <h1>Redirecting.......</h1>;
}

export default Checkout


