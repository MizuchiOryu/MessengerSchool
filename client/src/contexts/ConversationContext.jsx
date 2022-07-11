import React, { useState, useContext, useEffect } from 'react';

import { getConversation } from '../api'

const ConversationContext = React.createContext();

export function useConversation() {
  return useContext(ConversationContext);
}

export function ConversationProvider({ friendshipId, children }) {
  const [conversation, setConversation] = useState();

  useEffect(() => {
    getConversation(friendshipId).then((c) => setConversation(c))
  }, [])

  return (
    <ConversationContext.Provider value={{ conversation, setConversation }}>
      {children}
    </ConversationContext.Provider>
  );
}
