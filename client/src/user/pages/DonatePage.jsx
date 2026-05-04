import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { usePayment } from "../../hooks/usePayment";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const DonatePage = () => {
  const [amount, setAmount] = useState(0);
  const location = useLocation();
  const selectedCampaign = location.state?.campaign;

  const { handlePayment } = usePayment(); // Get the handlePayment function from the custom hook


  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-100 flex items-center justify-center px-4">

      <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center mt-6">

        {/* Campaign Image */}
        <img src={`${SERVER_URL}/${selectedCampaign?.image}`} className="rounded-xl mb-3" alt="campaign pic"/>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {selectedCampaign
            ? `Donate to ${selectedCampaign.title}`
            : "Select a Campaign"}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-500 mb-6">
          Every contribution brings change ❤️
        </p>

        {/* Divider */}
        <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full mb-6"></div>

        {/* Amount Options */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[300, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className="bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md 
              hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <input
          type="number"
          value={amount === 0 ? "" : amount} // Show empty input when amount is 0
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter custom amount"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 
          focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* CTA Button */}
        <button
          disabled={!amount || amount <= 0}
          onClick={() => handlePayment(selectedCampaign, amount)}
          className="w-full bg-linear-to-br from-indigo-600 to-blue-600 text-white py-3 rounded-xl 
          font-semibold shadow-lg hover:opacity-90 transition"
        >
          Proceed to Checkout
        </button>

      </div>
    </div>
  );
};

export default DonatePage;