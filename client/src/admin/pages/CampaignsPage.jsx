import { useMemo, useState } from "react";
import { useCampaign } from "../../context/CampaignContext";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CampaignsPage = () => {
    const { campaigns, setCampaigns } = useCampaign();
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ title: "", description: "", goal: "" });

    // const [campaigns, setcampaigns] = useState([
    //     { id: 1, title: "Help for Education", goal: 10000, raised: 4500, status: "pending" },
    //     { id: 2, title: "Medical Support", goal: 20000, raised: 12000, status: "approved" },
    //     { id: 3, title: "Food Drive", goal: 5000, raised: 5000, status: "completed" }
    // ]);

    const filtered = useMemo(() => {
        return campaigns.filter((c) =>
            c.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [campaigns, search]);

    const handleDelete = async (id) => {
        // setcampaigns(prev => prev.filter(c => c.id !== id));
        try {
            const response = await axios.delete(`${SERVER_URL}/api/admin/campaigns/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setCampaigns(prev => prev.filter(c => c.id !== id));
            } else {
                console.error("Failed to delete campaign:", response.data.message);
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
        }
    };

    const handleEdit = (c) => {
        setEditingId(c.id);
        setForm({ title: c.title, description: c.description, goal: c.goal });
    };

    const handleSave = async (id) => {
        // setcampaigns(prev =>
        //     prev.map(c => c.id === id ? { ...c, title: form.title, goal: Number(form.goal) } : c)
        // );
        // setEditingId(null);
        try {
            const response = await axios.patch(`${SERVER_URL}/api/admin/campaigns/${id}`, {
                title: form.title,
                description: form.description,
                goal: Number(form.goal)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setCampaigns(prev => prev.map(c => c.id === id ? { ...c, title: form.title, description: form.description, goal: Number(form.goal) } : c));
                setEditingId(null);
            } else {
                console.error("Failed to save campaign:", response.data.message);
            }
        } catch (error) {
            console.error("Error saving campaign:", error);
        }
    }


    const handleStatusChange = (id, status) => {
        setcampaigns(prev =>
            prev.map(c => c.id === id ? { ...c, status } : c)
        );
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Campaigns Management</h1>

            {/* Controls */}
            <div className="flex justify-between items-center mb-4 gap-2">
                <input
                    placeholder="Search Campaign..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>

            {/* Table */}
            <div className="p-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">Title</th>
                            <th>Goal (₹)</th>
                            <th>Raised (₹)</th>
                            <th>isActive</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((c) => (
                            <tr key={c.id} className="border-b hover:bg-gray-50">
                                <td className="py-2">
                                    {editingId === c.id ? (
                                        <input
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        />
                                    ) : c.title}
                                </td>

                                <td>
                                    {editingId === c.id ? (
                                        <input
                                            value={form.goal}
                                            onChange={(e) => setForm({ ...form, goal: e.target.value })}
                                        />
                                    ) : `₹${c.goal}`}
                                </td>

                                <td>₹{c.raised}</td>

                                <td className="px-4">
                                    <span
                                        className={`inline-block w-2 h-2 rounded-full ${c.isActive ? "bg-green-500" : "bg-gray-500"
                                            }`}
                                    ></span>
                                </td>


                                <td >
                                    <span className={`px-2 py-1 rounded text-sm font-medium ${c.active === "approved" ? "bg-green-100 text-green-600" :
                                        c.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                                            "bg-gray-200 text-gray-700"
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>


                                <td className="flex gap-2 py-2">
                                    {editingId === c.id ? (
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleSave(c.id)}>
                                            Save
                                        </button>
                                    ) : (
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded" onClick={() => handleEdit(c)}>
                                            Edit
                                        </button>
                                    )}

                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                        onClick={() => handleDelete(c.id)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                                        onClick={() => handleStatusChange(c.id, "approved")}
                                    >
                                        Approve
                                    </button>

                                    <button
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                                        onClick={() => handleStatusChange(c.id, "pending")}
                                    >
                                        Pending
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CampaignsPage
