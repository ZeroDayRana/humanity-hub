import { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [image, setImage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to create a campaign");
        return;
      }
      // ✅ Create FormData (required for file upload)
      const formData = new FormData();

      // ✅ Append all fields to FormData
      formData.append("title", title);
      formData.append("description", description);
      formData.append("goal", goal);
      formData.append("image", image); // must match backend name

      // ✅ Send to backend
      const response = await axios.post(`${SERVER_URL}/api/campaigns`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // important for file upload
        },
      });

      // ✅ Reset form
      setTitle("");
      setDescription("");
      setGoal("");
      setImage(null);

      // ✅ Navigate to donate page after campaign creation
      navigate("/donate");

      // ✅ Alert success
      alert("Campaign created successfully");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error creating campaign");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 mt-16">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create Fundraiser Campaign
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Campaign Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 h-28"
              placeholder="Tell your story..."
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Funding Goal (₹)</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full border rounded-lg p-2"
              placeholder="Enter amount"
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Upload Image</label>
            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 transition bg-gray-50">
              <div className="flex flex-col items-center gap-2 text-gray-600">
                {/* Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-blue-500"
                  fill="none"
                  viewBox="0 0 28 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 12v6m0 0l-3-3m3 3l3-3"
                  />
                </svg>

                <p className="text-sm">
                  {image ? image.name : "Click to upload or drag & drop"}
                </p>
                <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
              </div>

              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>

    <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            Launch Campaign
          </button>
      </form>

      {title && (
        <div className="mt-10 p-6 border rounded-xl bg-gray-50">
          <h2 className="text-2xl font-semibold">Preview</h2>
          <p className="mt-2 font-bold">{title}</p>
          <p className="mt-2 text-gray-600">{description}</p>
          <p className="mt-2 text-green-600 font-semibold">
            Goal: ₹{goal === "" ? "0" : goal}
          </p>
        </div>
      )}
      </div>
    </div>
  )
}

export default CreateCampaignPage