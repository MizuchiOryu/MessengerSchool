import React from "react";

import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

import Conversation from "./Conversation";

import { ConversationProvider } from "../contexts/ConversationContext";

export default () => {

  return (
    <Container fluid className="d-flex h-100">
      <ConversationProvider>
          <Conversation/>
      </ConversationProvider>
    </Container>
  )
}
