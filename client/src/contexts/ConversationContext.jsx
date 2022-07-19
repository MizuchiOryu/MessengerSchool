import React, { useContext, useEffect, useState } from 'react';
import { getFriendship, getMessages } from "../api";

import { useEnv } from './EnvContext';
import io from 'socket.io-client'

const ConversationContext = React.createContext();
export function useConversation() {
  return useContext(ConversationContext);
}

export function ConversationProvider({ friendshipId, children }) {

  const [socket, setSocket] = useState();
  const [friendship, setFriendship] = useState({})
  const [messages, setMessages] = useState({})

  const env = useEnv();

  const loadMessages = () => {
    console.log('loading messages')
    getMessages(friendshipId).then(( {data: messages} ) => {
      setMessages(messages)
    }).catch(e => { debugger })
  }

  useEffect(()=> {
    getFriendship(friendshipId).then(({data: friendship}) => {
      setFriendship(friendship)
      loadMessages() 

      const _socket = io(
        env.VITE_API_URL,
        {
          query: {
            user: friendship._user.id,
            conversation: friendshipId,
          },
          reconnection: false,
          transports: ['websocket', 'polling', 'flashsocket']
        },
      );
      setSocket(_socket);
      return () => _socket.close();
    }).catch(e => { debugger })
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', () => loadMessages());
    }
  }, [socket]);

  const sendMessage = (messageInput) => {
    const message = {
      owner: friendship._user.id,
      friendship: friendshipId,
      text: messageInput.current.value,
    };
    socket.emit('send-message', message);
    messageInput.current.value = '';
    loadMessages();
  }

  return (
    <ConversationContext.Provider value={{ friendship, messages, sendMessage }}>
      {children}
    </ConversationContext.Provider>
  );
}
