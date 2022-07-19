import React, { useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';

import {useParams} from 'react-router-dom';
import Conversation from "./Conversation";

import { ConversationProvider } from "../contexts/ConversationContext";

export default () => {
  const {friendshipId} = useParams()

  return (
    <Container fluid className="d-flex h-100 px-0">
      <ConversationProvider friendshipId={friendshipId} >
        <Conversation/>
      </ConversationProvider>
    </Container>
  )
}
