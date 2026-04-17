import { useState} from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CampaignDetailsPage from './pages/CampaignDetailsPage'
import { CampaignProvider } from './context/CampaignContext';
import { UserProvider } from './context/UserContext';
import CreateCampaignPage from './pages/CreateCampaignPage';
import DonatePage from './pages/DonatePage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  // Search state
      const [search, setSearch] = useState("");
  return (
    <div>
      <UserProvider>
        <CampaignProvider>
          <Navbar search={search} setSearch={setSearch} />
          <Routes>
            <Route path="/" element={<HomePage search={search}/>}/>
            <Route path="/donate" element={<DonatePage/>}/>
            <Route path="/signup" element={<SignupPage/>} /> 
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />
            <Route path="/create-campaign" element={<CreateCampaignPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/campaign/:id" element={<CampaignDetailsPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
        </Routes>
        <Footer />
        </CampaignProvider>
      </UserProvider>
    </div>
  )
}

export default App
