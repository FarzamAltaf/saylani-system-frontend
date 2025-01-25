import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import { useEffect, useState } from 'react';
import Index from './pages';
import Signin from './pages/login/signin';
import Signup from './pages/login/signup';
import User from './pages/Dashboard/User/user';
import Admin from './pages/Dashboard/Admin/admin';
import Cookies from "js-cookie";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userData = Cookies.get('user');

    if (userData) {
      const parsedData = JSON.parse(userData);
      const userRole = parsedData.role;

      if (token && userRole) {
        setIsAuthenticated(true);
        setRole(userRole);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route index element={isAuthenticated ? <Navigate to={role === "admin" ? "/dashboard/admin" : "/dashboard/user"} /> : <Index />} />

        <Route path='/signin' element={isAuthenticated ? <Navigate to={role === "admin" ? "/dashboard/admin" : "/dashboard/user"} /> : <Signin />} />
        <Route path='/signup' element={isAuthenticated ? <Navigate to={role === "admin" ? "/dashboard/admin" : "/dashboard/user"} /> : <Signup />} />

        <Route path="/dashboard">
          <Route path="user" element={isAuthenticated && role === "user" ? <User /> : <Navigate to="/" />} />
          <Route path="admin" element={isAuthenticated && role === "admin" ? <Admin /> : <Navigate to="/" />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
