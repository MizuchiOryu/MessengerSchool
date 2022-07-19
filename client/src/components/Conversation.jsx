import React, { useEffect, useRef } from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { useConversation } from '../contexts/ConversationContext';

import Loader from './Loader'

export default function Conversation() {
  const messageInput = useRef();
  const conversationEnd = useRef();

  const { friendship, messages, sendMessage, deleteMessage } = useConversation();

  const friend = friendship?.friend

  const send = (e) => {
    e.preventDefault()
    sendMessage(messageInput)
  }

  useEffect(() => {
    if (conversationEnd?.current) {
      conversationEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages])

  return friendship?.id 
    ?	(
      <Container className="border-top-0 d-flex flex-column p-0">
        <div className="d-flex align-items-center p-2 bg-1">
          <div className="pl-2">
            <h1>{`${friend?.firstName} ${friend?.lastName}`}</h1>
          </div>
        </div>
        <Container className="pb-4 mt-auto scroll">
          {messages.length > 0
            ? messages.map((m) => {
              if (m.owner === friendship._user.id) {
                return (
                  <div className="d-flex align-items-center justify-content-end mb-1 " key={m.id}>
                    { m.isDeleted ? 
                        (
                          <p className="text-white bubble bg-primary py-1 px-2 no-stretch">
                            <i>Ce message a été supprimé</i>
                          </p>
                        ) : 
                        (
                          <p 
                            className="text-white bubble bg-primary py-1 px-2 no-stretch"
                            onClick={() => deleteMessage(m.id)}
                          >{m.text}</p>
                        )
                    }
                  </div>
                );
              }
              return (
                <div className="d-flex align-items-center justify-content-start mb-1" key={m.id}>
                  { m.isDeleted 
                    ? (
                        <p className="text-white bubble bg-secondary py-1 px-2 no-stretch">
                          <i>Ce message a été supprimé</i>
                        </p>
                      )
                      : (
                        <p className="text-white bubble bg-secondary py-1 px-2 no-stretch">{m.text}</p>
                      )
                  }
                </div>
              );
            })
            : 
              (<p className="p-5 text-center text-muted">Aucun message</p>)
          }
          <div ref={conversationEnd} />
        </Container>
        <Form onSubmit={send} className="w-100 framed-top">
          <Container fluid className="d-flex align-items-end justify-content-between px-0">
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
    : (<Loader />)
}
