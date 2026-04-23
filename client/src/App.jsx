import { Routes, Route } from "react-router-dom";
import './App.css'
import { UserProvider } from './context/UserContext';
import { CampaignProvider } from './context/CampaignContext';
import { DonationProvider } from "./context/donationContext";
import UserRoutes from './user/UserRoutes';
import AdminRoutes from './admin/AdminRoutes';

function App() {
  return (
    <div>
      <UserProvider>
        <CampaignProvider>
          <DonationProvider>
            <Routes>
              {/* User Routes */}
              <Route path="/*" element={<UserRoutes />} />

              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Routes>
          </DonationProvider>
        </CampaignProvider>
      </UserProvider>
    </div>
  )
}

export default App
