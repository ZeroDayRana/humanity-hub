import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import CampaignsPage from './pages/CampaignsPage'
import TransactionsPage from './pages/TransactionsPage'



function AdminRoutes() {
    // Search state
    const [search, setSearch] = useState("");
    return (
        <div>
            <AdminLayout>
                <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                </Routes>
            </AdminLayout>
        </div>
    )
}

export default AdminRoutes
