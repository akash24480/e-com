
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginUpPage from "./pages/LoginUpPage";
import SignUpPage from "./pages/SignUpPage";
import {Routes, Route, Navigate} from 'react-router-dom'
import useUserStore from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminPage from "./pages/AdminPage";

const App = () => {
  
  const {user,checkAuth,checkingAuth} = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if(checkingAuth) return <LoadingSpinner />

  return(
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(66,133,244,0.3)_0%,rgba(33,78,158,0.2)_45%,rgba(0,0,0,0.1)_100%)]
' />
				</div>
			</div>
      <div className="relative z-50 pt-20">
      <Navbar />
      <Routes>
        <Route path = '/' element = {<HomePage />} />
        <Route path = '/signup' element = {!user ? <SignUpPage /> : <Navigate to={'/'} />} />
        <Route path = '/login' element = {!user ? <LoginUpPage /> : <Navigate to={'/'} />} />
        <Route path = '/dashboard' element = {user?.role === 'admin' ? <AdminPage /> : <Navigate to={'/login'} />} />


      </Routes>
    </div>
    <Toaster />
    </div>
  ) 
}


export default App;