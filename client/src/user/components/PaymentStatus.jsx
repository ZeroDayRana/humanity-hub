import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PaymentStatus = () => {
    const { orderId } = useParams();

    const [status, setStatus] = useState("loading"); // loading | success | failed | error
    const [message, setMessage] = useState("");
    const [campaignStatus, setCampaignStatus] = useState("");

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get(
                    `${SERVER_URL}/api/donations/payment-status/${orderId}`
                );

                setStatus(res.data.status);   // 👈 expected: success / failed / pending
                setMessage(res.data.message); // 👈 actual text to show
                setCampaignStatus(res.data.campaignStatus); // 👈 campaign status

            } catch (err) {
                setStatus("error");
                setMessage("Something went wrong");
                setCampaignStatus("");
            }
        };

        fetchStatus();
    }, [orderId]);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">

            {status === "loading" && (
                <h1 className="text-lg font-semibold">
                    Checking payment status...
                </h1>
            )}

            {status !== "loading" && (
                <>
                    <h1 className="text-2xl font-bold">
                        {message}
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Order ID: {orderId}
                    </p>
                </>
            )}

            {campaignStatus && (
                <p className="mt-4 text-lg font-semibold">
                    Campaign Status: {campaignStatus}
                </p>
            )}

            {/* 🔥 Home Button */}
            <Link
                to="/"
                className="mt-6 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go to Home
            </Link>
        </div>
    );
};

export default PaymentStatus;