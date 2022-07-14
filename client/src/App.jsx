import React, { Suspense,lazy, useEffect } from 'react'
import { Link, Route, Routes } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ProtectedRoute from "./hooks/protected";
import useAuth from "./hooks/auth";


const Loader = lazy(() => import("./components/Loader"));
const Chat = lazy(() => import("./components/Chat"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Verify = lazy(() => import("./components/Verify"));
const ResetPasswordRequest = lazy(() => import("./components/ResetPasswordRequest"));
const ResetPasswordConfirm = lazy(() => import("./components/ResetPasswordConfirm"));


const App = () => {
  const { token, onLogout } = useAuth();

  return (
    <>
      <Navbar id='nav' bg="dark" variant="dark">
        <Container>
          <Link className='navbar-brand' to='/'>MsMessenger</Link>
          <Nav className="me-auto">
            
            {token && (
              <>
                <Link className='nav-link' to="/profile">Profil</Link>
                <Button variant="primary" onClick={onLogout} >Déconnexion</Button>
              </>
            )}
            {!token && (
              <>
                <Link className='nav-link' to="/register">Register</Link>
                <Link className='nav-link' to="/login">Login</Link>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
      <div id='main'>
        <Suspense fallback={<Loader/>}>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="/verify/" element={<Verify />} />
            <Route path="/reset-password-request/" element={<ResetPasswordRequest />} />
            <Route path="/reset-password-confirm/" element={<ResetPasswordConfirm />} />
            <Route exact path="/" 
                element={
                  <ProtectedRoute>
                    <Chat/>
                  </ProtectedRoute>
                }
              />
            <Route exact path="/profile" 
                element={
                  <ProtectedRoute>
                    <></>
                  </ProtectedRoute>
                }
              />
          </Routes>
        </Suspense>
        
      </div>
    </>
  )
}

export default App