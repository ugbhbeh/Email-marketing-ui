import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthProvider from './services/Authprovider'
import AuthContext from './services/AuthContext'

import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'

import './App.css'

function AppRoutes() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
    </Routes>
  );
}

function App() {

  return (
   <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <TopBar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
