import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ResetPasswordPage = () => {
  const [isError, setIsError] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // 👈 new
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setMessage("Please fill all fields");
      setIsError(true);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match ❌");
      setIsError(true);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${SERVER_URL}/api/user/reset-password/${token}`,
        { password }
      );

      if (response.data.success) {
        setMessage("Password reset successful ✅");
        setIsError(false);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage(error.response?.data?.message || "Something went wrong ❌");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4">
      <div className="p-6 shadow-lg rounded-xl w-96">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 mb-4"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="bg-green-500 text-white px-4 py-2 w-full"
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>

      <p
        style={{
          color: isError ? "red" : "green"
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default ResetPasswordPage;