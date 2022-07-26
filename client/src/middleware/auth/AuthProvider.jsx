import React,{useEffect,createContext,useCallback,useState} from 'react'
import { useNavigate,useLocation } from "react-router-dom";
import {login,me } from '../../api/auth'

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = React.useState({});
  
  const refreshUser = useCallback(() => {
    me().then(({ data }) => {
      setUser(data)
    }).catch((e) => {
      console.error(e)
      navigate("/login")
    })
  },[]);
  
  const [token, setToken] = React.useState(()=>{
    let u = sessionStorage.getItem("token") ?? null
    if(u) setUser(refreshUser())
    return u
  });



  const handleLogin = useCallback((email,password) => {
    return new Promise((resolve, reject) => {
      login(email,password)
        .then(({data})=>{
          sessionStorage.setItem("token", data?.token);
          resolve(true)
        })
        .catch((error)=>{
          reject(error)
        })
    })
  },[])

  const handleLogout = useCallback((event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    navigate("/login")
  },[])



  const value = {
    token,
    user,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRefreshUser:refreshUser
  };

  return (
        <AuthContext.Provider value={value}>
          {children}
        </AuthContext.Provider>
  );
};
export default AuthProvider;
