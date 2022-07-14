import React,{useEffect,createContext,useCallback,useState} from 'react'
import { useNavigate,useLocation } from "react-router-dom";
import {login } from '../../api/auth'

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  const [token, setToken] = React.useState(()=>{
    return sessionStorage.getItem("token") ?? null
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = useCallback((email,password) => {
    return new Promise((resolve, reject) => {
      login(email,password)
        .then(({data})=>{
          sessionStorage.setItem("token", data?.token);
          navigate('/');
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },[])

  const handleLogout = useCallback((event) => {
    event.preventDefault();
    setToken(null);
    navigate("/login")
  },[])

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
  );
};
export default AuthProvider;
