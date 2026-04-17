import { useState } from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLink, setIsLink] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter your email");
      setIsLink(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}/api/user/forgot-password`, { email });
      if (response.data.success) {
        setResetLink(response.data.link); // 👈 store link
        console.log(response.data.link);
        setMessage("Click here to reset password");
        setIsLink(true); // 👈 now it behaves like a link clickable
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      setMessage("Something went wrong ❌");
      setIsLink(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4">
      <div className="p-6 shadow-lg rounded-xl w-96">
        <h2 className="text-xl mb-4">Forgot Password</h2>
        <input type="email" className="w-full border p-2 mb-4" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 w-full" onClick={handleSubmit} disabled={loading} >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>

      {/* Message or Reset Password Link */}
      {isLink ? (
        <p>
          <a href={resetLink} style={{ color: "blue", textDecoration: "underline" }} >
            {message}
          </a>
        </p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default ForgotPasswordPage