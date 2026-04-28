import { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DonatePage from './pages/DonatePage';
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignupPage from './pages/SignupPage'
import CreateCampaignPage from './pages/CreateCampaignPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentStatus from './components/PaymentStatus';
import UnauthorizedPage from './pages/UnauthorizedPage';

function UserRoutes() {
    // Search state
    const [search, setSearch] = useState("");
    return (
        <div>
            <Navbar search={search} setSearch={setSearch} />
            <Routes>
                <Route path="/" element={<HomePage search={search} />} />
                <Route path="/donate" element={<DonatePage search={search} setSearch={setSearch} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/create-campaign" element={<CreateCampaignPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-status/:orderId" element={<PaymentStatus />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default UserRoutes
