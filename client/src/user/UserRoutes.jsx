import { lazy, Suspense, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
const ExploreCampaignsPage = lazy(() => import('./pages/ExploreCampaignsPage')); // Lazy load ExploreCampaignsPage
const DonatePage = lazy(() => import('./pages/DonatePage')); // Lazy load DonatePage
const LoginPage = lazy(() => import('./pages/LoginPage')); // Lazy load LoginPage
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage')); // Lazy load ForgotPasswordPage
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const CreateCampaignPage = lazy(() => import('./pages/CreateCampaignPage')); // Lazy load CreateCampaignPage
const SignupPage = lazy(() => import('./pages/SignupPage')); // Lazy load SignupPage
const CheckoutPage = lazy(() => import('./pages/CheckoutPage')); // Lazy load CheckoutPage
const PaymentStatusPage = lazy(() => import('./pages/PaymentStatusPage')); // Lazy load PaymentStatus
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage')); // Lazy load UnauthorizedPage

function UserRoutes() {
    // Search state
    const [search, setSearch] = useState("");
    return (
        <div>
            <Navbar search={search} setSearch={setSearch} />
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<HomePage search={search} />} />

                    <Route path="/explore-campaigns" element={<ExploreCampaignsPage search={search} setSearch={setSearch} />} />

                    <Route path="/donate" element={<DonatePage />} />

                    <Route path="/signup" element={<SignupPage />} />   
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

                    <Route path="/create-campaign" element={<CreateCampaignPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    <Route path="/payment-status/:orderId" element={<PaymentStatusPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />
                </Routes>
            </Suspense>
            <Footer />
        </div>
    )
}

export default UserRoutes
