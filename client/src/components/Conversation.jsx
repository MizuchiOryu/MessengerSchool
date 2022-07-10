import React, { useRef, useEffect, useState } from 'react';

import io from 'socket.io-client'

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { useConversation } from '../contexts/ConversationContext';
import { useEnv } from '../contexts/EnvContext';

import Loader from './Loader'

export default function Conversation() {
  const [socket, setSocket] = useState();
  const [messages, setMessages] = useState([]);

  const messageInput = useRef();
  const { conversation } = useConversation();
  const env = useEnv();

  const fetchMessages = () => {
    if (conversation) {
      setMessages(conversation.messages)

      const _socket = io(
        env.VITE_API_URL,
        {
          query: {
            id: conversation.id,
          },
          reconnection: false,
          transports: ['websocket', 'polling', 'flashsocket']
        },
      );
      setSocket(_socket);

      return () => newSocket.close();
    };
  };

  useEffect(() => {
    fetchMessages();
  }, [conversation]);

  function sendMessage(e) {
    e.preventDefault();
    const message = {
      friendshipId: conversation.friendshipId,
      sender: null,
      text: messageInput.current.value,
    };
    socket.emit('send-message', message);
    messageInput.current.value = '';
    fetchMessages();
  }

  useEffect(() => {
    if (socket) {
      socket.on('receive-message', () => {
        fetchMessages();
      });
    }
  }, [socket]);

  return (
    <>
      {conversation
        ?	(
          <Container className="framed border-top-0 d-flex flex-column p-0">
            <div className="framed-bottom d-flex align-items-center p-2 bg-1">
              <div className="pl-2">
                <p>((friend name ici))</p>
              </div>
            </div>
            <Container className="pb-4 mt-auto scroll">
              {messages.length > 0
                ? messages.map((m) => {
                  if (m.sender === username) {
                    return (
                      <div className="d-flex align-items-center justify-content-end mb-1 " key={m.id}>

                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 50, hide: 0 }}
                          overlay={(
                            <Tooltip id="button-tooltip">
                              {m.createdAt.time}
                            </Tooltip>
                          )}
                        >
                          <p className=" text-white bubble bg-primary py-1 px-2 no-stretch">{m.text}</p>
                        </OverlayTrigger>

                      </div>
                    );
                  }
                  return (
                    <div className="d-flex align-items-center justify-content-start mb-1" key={m.id}>
                      <OverlayTrigger
                        placement="left"
                        delay={{ show: 50, hide: 0 }}
                        overlay={(
                          <Tooltip id="button-tooltip">
                            {m.createdAt.time}
                          </Tooltip>
                        )}
                      >
                        <p className="bubble bg-secondary py-1 px-2 no-stretch">{m.text}</p>
                      </OverlayTrigger>
                    </div>
                  );
                })
                : <p className="p-5 text-center text-muted">Aucun message</p>}
              {/* <div ref={conversationEnd} /> */}
            </Container>
            <Form onSubmit={sendMessage} className="w-100 framed-top">
              <Container fluid className="d-flex align-items-end justify-content-between py-2 px-0">
                <Form.Group className="m-0 w-100">
                  <Form.Control className="w-100 square border-0 bg-3" required placeholder="Message..." ref={messageInput} type="text" />
                </Form.Group>
                <Button type="submit" className="square">
                  Envoyer
                </Button>
              </Container>
            </Form>
          </Container>
        )
        :	(<Loader />)}
    </>
  );
}
