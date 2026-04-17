import { useState, useContext } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
function LoginPage() {
  const { login } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    //Manually keep old data ...formData
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email.trim() || !formData.password.trim()) {
        alert("Please fill all fields");
        return;
      }
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}/api/user/login`, formData);

      console.log(response.data); // remove later

      // ✅ check success properly
      if (response.data.success) {
        // use context login
        login(response.data.data, response.data.token);
        alert("Login successful");

        // redirect to home
        navigate("/", { replace: true });

        // ✅ reset only after success
        setFormData({
          email: "",
          password: "",
        });
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // ✅ BEST PRACTICE
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Mail className="text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your email"
                required
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="flex items-center border rounded-lg px-3 mt-1">
              <Lock className="text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your password"
                required 
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white" }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between items-center text-sm mt-2">
          <span className="text-gray-500">
            Don’t have an account?
            <Link to="/signup" className="text-blue-600 cursor-pointer ml-1">
              Sign up
            </Link>
          </span>

          {/* Go to the Forgot Password page */}
          <Link to="/forgot-password" className="text-blue-600">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
