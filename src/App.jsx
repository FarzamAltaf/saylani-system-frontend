import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';
import Index from './pages';
import Signin from './pages/login/signin';
import Signup from './pages/login/signup';
import User from './pages/Dashboard/User/user';
import Admin from './pages/Dashboard/Admin/admin';
import Cookies from "js-cookie";
import UserSidebar from "./pages/Dashboard/User/components/sidebar";
import AdminSidebar from "./pages/Dashboard/Admin/components/sidebar";
import EditUserProfile from "./pages/Dashboard/User/profile/editProfile";
import EditAdminProfile from "./pages/Dashboard/Admin/components/editProfile";
import UserTable from "./pages/Dashboard/Admin/users";
import Verification from "./pages/login/verify";
import UpdatePassword from "./pages/login/upadeProfile";
import AddLoan from "./pages/Dashboard/Admin/addLoan";
import LoanList from "./pages/Dashboard/Admin/loanlist";
import ShowLoan from "./pages/Dashboard/User/showloan";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);
  const verificationCode = Cookies.get('verificationCode'); // Get verificationCode from cookies

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userData = Cookies.get('user');

    // If verification is still pending, route to '/verify'
    if (verificationCode) {
      setIsAuthenticated(false);
      setRedirectTo("/verify");
      setLoading(false);
      return;
    }

    if (userData) {
      const parsedData = JSON.parse(userData);
      const userRole = parsedData.role;

      if (token && userRole) {
        setIsAuthenticated(true);
        setRole(userRole);

        if (userRole === "admin") {
          setRedirectTo("/admin/dashboard");
        } else {
          setRedirectTo("/user/dashboard");
        }
      } else {
        setIsAuthenticated(false);
        setRedirectTo("/signin");
      }
    } else {
      setIsAuthenticated(false);
      setRedirectTo("/signin");
    }

    setLoading(false);
  }, [verificationCode]); // Depend on verificationCode

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        {/* Main Route */}
        <Route index element={isAuthenticated ? <Navigate to={redirectTo} /> : <Index />} />

        {/* Login and Signup routes */}
        <Route path='/signin' element={isAuthenticated ? <Navigate to={redirectTo} /> : <Signin />} />
        <Route path='/signup' element={isAuthenticated ? <Navigate to={redirectTo} /> : <Signup />} />

        {/* Verification Route */}
        <Route path='/verify' element={verificationCode ? <Verification /> : <Navigate to="/" />} />

        {/* User Routes */}
        <Route path="/user" element={isAuthenticated && role === "user" ? <UserSidebar /> : <Navigate to="/signin" />}>
          <Route path="dashboard" element={<User />} />
          <Route path="edit-profile" element={<EditUserProfile />} />
          <Route path="update-password" element={<UpdatePassword />} />
          <Route path="allLoans" element={<ShowLoan />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={isAuthenticated && role === "admin" ? <AdminSidebar /> : <Navigate to="/signin" />}>
          <Route path="dashboard" element={<Admin />} />
          <Route path="edit-profile" element={<EditAdminProfile />} />
          <Route path="users" element={<UserTable />} />
          <Route path="addloans" element={<AddLoan />} />
          <Route path="getloans" element={<LoanList />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
