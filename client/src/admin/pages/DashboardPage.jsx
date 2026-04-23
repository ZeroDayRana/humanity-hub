import { useEffect, useMemo, useState } from "react";
import { useCampaign } from "../../context/CampaignContext";
import { useDonation } from "../../context/donationContext";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const DashboardPage = () => {
  // const stats = [
  //   { title: "Total Donations", value: "₹45,000" },
  //   { title: "Total Users", value: "1,200" },
  //   { title: "Active Fundraisers", value: "35" },
  //   { title: "Transactions", value: "820" }
  // ];
  const { campaigns } = useCampaign();
  const { donations } = useDonation();
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  // Calculate total donations campaigns data
  const totalDonations = useMemo(() => {
    return campaigns.reduce((sum, c) => sum + c.raised, 0);
  }, [campaigns]);

  // Fetch admin users for dashboard stats
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  // Calculate active campaigns from campaigns data
  const activeCampaigns = useMemo(() => {
    const totalActiveCampaigns = campaigns.filter(c => c.isActive);
    return totalActiveCampaigns.length;
  }, [campaigns]);

  // Calculate total transactions from donations data
  const totalTransactions = useMemo(() => {
    return donations.length;
  }, [donations]);

  const stats = [
    { title: "Total Donations", value: `₹${totalDonations}` },
    { title: "Total Users", value: `${users.length}` },
    { title: "Active Campaigns", value: `${activeCampaigns}` },
    { title: "Total Transactions", value: `${totalTransactions}` }
  ];

  const activities = [
    "Mohit donated ₹500",
    "New fundraiser created",
    "Amit donated ₹1200",
    "Fundraiser approved"
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, index) => (
          <div key={index} className="p-4 bg-white rounded shadow">
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4">
          <h2 className="font-semibold mb-2">Donations Overview</h2>
          <div className="h-40 flex items-center justify-center bg-white text-gray-400 rounded shadow">
            Chart Coming Soon
          </div>
        </div>

        <div className="p-4">
          <h2 className="font-semibold mb-2">User Growth</h2>
          <div className="h-40 flex items-center justify-center bg-white text-gray-400 rounded shadow">
            Chart Coming Soon
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          {activities.map((act, index) => (
            <li key={index} className="border-b pb-2 text-sm">
              {act}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;