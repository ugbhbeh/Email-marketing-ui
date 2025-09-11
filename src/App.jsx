import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import './App.css'

import AuthProvider from './services/Authprovider'
import AuthContext from './services/AuthContext'

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import TopBar from './components/TopBar'
import CampaignsPage from './components/Campaigns'
import CampaignDetailsPage from './components/CampaignsDetails'
import CustomersPage from './components/Customer'
import CustomerDetailsPage from './components/CustomerDetails'
import MailingPage from './components/Mailing'
import EmailDetailsPage from './components/EmailDetails'

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
      <Route path="/campaigns" element={ <CampaignsPage />} />
      <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
      <Route path="/customers" element={ <CustomersPage />} />
      <Route path="/customers/:id" element={ <CustomerDetailsPage />} />
      <Route path="/mailing" element={ <MailingPage />} />
      <Route path="/mail/:id" element={<EmailDetailsPage/> } />
    </Routes>
  );
}

function App() {

  return (
   <BrowserRouter>
      <AuthProvider>
        <div>
          <TopBar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
