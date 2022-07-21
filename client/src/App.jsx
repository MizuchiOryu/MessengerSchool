import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Navigate, Link, Route, Routes } from "react-router-dom";

import Loader from './components/Loader';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import ProtectedRoute from "./hooks/protected";
import useAuth from "./hooks/auth";
import Error404 from './components/Error404'
import AdminLogs from './components/AdminLogs'

const Chat = lazy(() => import("./components/Chat"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Verify = lazy(() => import("./components/Verify"));
const ResetPasswordRequest = lazy(() => import("./components/ResetPasswordRequest"));
const ResetPasswordConfirm = lazy(() => import("./components/ResetPasswordConfirm"));

import { me } from './api/auth';
import Profile from './components/Profile';

const App = () => {
  const { token } = useAuth();
  const [user, setUser] = useState({})

  useEffect(() => {
    if (token) {
      me().then(({ data }) => {
        setUser(data)
      }).catch((e) => {
        console.error(e)
      })
    }
  }, [])

  return (
    <>
      <Navbar id='nav' bg="dark" variant="dark">
        <Container>
          <Link className='navbar-brand' to='/'>MsMessenger</Link>
          <Nav className="me-auto">
            {token && (
              <React.Fragment>
                <Link className='nav-link' to="/profile">{user.firstName}</Link>
                {user.isAdmin && (<Link className='nav-link' to="/logs">Logs</Link>)}
              </React.Fragment>
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
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/profile" />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route path="/verify/" element={<Verify />} />
            <Route path="/reset-password-request/" element={<ResetPasswordRequest />} />
            <Route path="/reset-password-confirm/" element={<ResetPasswordConfirm />} />
            <Route exact path="/chat/:friendshipId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }/>
            <Route exact path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }/>
            <Route exact path="/logs" 
              element={
                <ProtectedRoute>
                  <AdminLogs/>
                </ProtectedRoute>
              }/>
            <Route path="*" element={<Error404/>} />
            </Routes>
          </Suspense>
        </div>
      </>
  )
}
export default App;