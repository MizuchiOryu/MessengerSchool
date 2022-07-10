import React from 'react'
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import Chat from './components/Chat';

export default () => {
  return (
    <>
      <BrowserRouter>
        <Navbar id='nav' bg="dark" variant="dark">
          <Container>
            <Link className='navbar-brand' to='/'>MsMessenger</Link>
            <Nav className="me-auto">
              <Link className='nav-link' to="/profile">Profil</Link>
              <Link className='nav-link' to="/logout">Déconnexion</Link>
            </Nav>
          </Container>
        </Navbar>
        <div id='main'>
          <Routes> 
            <Route exact path="/" element={<Chat />} />
            <Route exact path="/profile" element={<></>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

