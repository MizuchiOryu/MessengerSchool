import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/auth';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { acceptInvite, cancelInvite, deleteFriend, getFriends, getInvites, getPendingInvites, sendFriendRequest } from '../api'; import { Badge, Col, Row } from 'react-bootstrap';

import InviteCard from './InviteCard'

export default () => {
  const { onLogout } = useAuth();

  const [error, setError] = useState()
  const inputRef = useRef()

  const [friends, setFriends] = useState([])
  const [pendingInvites, setPendingInvites] = useState([])
  const [invites, setInvites] = useState([])
  const [reports, setReports] = useState([])
  const [reportForm, setReportForm] = useState(false)


  const loadFriends = () => {
    getFriends().then(({ data }) => setFriends(data)).catch((e) => { debugger })
  }

  const loadPendingInvites = () => {
    getPendingInvites().then(({ data }) => setPendingInvites(data)).catch((e) => { debugger })
  }

  const loadInvites = () => {
    getInvites().then(({ data }) => setInvites(data)).catch((e) => { debugger })
  }

  const loadReports = () => {
    getReports().then(({ data }) => setReports(data)).catch((e) => { debugger })
  }

  const loadData = () => {
    loadFriends()
    loadInvites()
    loadReports()
    loadPendingInvites()
  }

  useEffect(() => {
    loadData()
  }, [])

  //Set active form to show
  useCallback((e) => {
    e.preventDefault();
    setActiveForm(e.target.id)
  }, [])


  const sendRequest = (e) => {
    e.preventDefault()

    const friendId = Number(inputRef.current.value)

    if (isNaN(friendId)) {
      return setError('Id ami invalide')
    }

    sendFriendRequest(inputRef.current.value).then(
      (res) => {
        inputRef.current.value = ''
      }
    ).catch((e) => {
      setError(e.response.data)
    }).finally(() => loadData())
  }

  const onAcceptInvite = (friendId) => {
    acceptInvite(friendId)
      .then(({ data }) => { })
      .catch((e) => { debugger })
      .finally(() => loadData())
  }

  const onCancelInvite = (friendId) => {
    cancelInvite(friendId)
      .then(({ data }) => { })
      .catch((e) => { debugger })
      .finally(() => loadData())
  }

  const OnDeleteFriend = (friendId) => {
    deleteFriend(friendId)
      .then(({ data }) => { })
      .catch((e) => { debugger })
      .finally(() => loadData())
  }

  const OnReportFriend = (data) => {
    const { selectedFriend, reason } = data;
    reportFriend(selectedFriend, reason)
      .then(({ data }) => { })
      .catch((e) => { debugger })
      .finally(() => loadData())
  }

  const OnRemoveReportFriend = (friendId) => {
    removeReportFriend(friendId)
      .then(({ data }) => { })
      .catch((e) => { debugger })
      .finally(() => loadData())
  }

  const OnReportFriendForm = (friend) => {
    setReportForm(
      <Form onSubmit={OnReportFriend} className="sticky-top">
        <div className='d-flex justify-content-between'>
          <h1>Signalement de {`${f.friend.firstName} ${f.friend.lastName}`}</h1>
          <Button variant="secondary" onClick={(e) => { e.stopPropagation(); setReportForm(false) }}>Fermer</Button>
        </div>
        <Form.Control name="selectedFriend" type="hidden" value={friend.id} />
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Raison du signalement</Form.Label>
          <Form.Control as="textarea" rows="3" name="reason" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Signaler
        </Button>
      </Form>
    )
  };


  return (
    <React.Fragment>
      <h2 className='mt-3' >Ajouter un ami</h2>
      {error &&
        (
          <div>
            <Badge bg="danger"> {error} </Badge>
          </div>
        )
      }
      <input type='text' ref={inputRef}></input>
      <Button onClick={sendRequest}>Ajouter</Button>

      <h2 className='mt-3'>Mes amis</h2>
      <ul>
        {friends.map(f => (
          <li key={f.friendship}>
            <div className='d-flex align-items-center'>
              <span className="me-2">{`${f.friend.firstName} ${f.friend.lastName}`}</span>
              <Button>
                <Link className='text-white' to={`/chat/${f.friendship}`}>Discuter</Link>
              </Button>
              <Button
                className='ms-2'
                variant='danger'
                onClick={() => OnDeleteFriend(f.friend.id)}>Supprimer</Button>

              {
                reports.find(r => r.target === f.friend.id)
                  ? (<Button variant='warning' onClick={() => OnReportFriendForm(f.friend)}>Signaler</Button>)

                  : (<Button variant='success' onClick={() => OnRemoveReportFriend(f.friend)}>Annuler le signalement</Button>)
              }

            </div>
          </li>)
        )}
      </ul>

      {reportForm}

      <h2>Mes invitations</h2>
      <Row>
        <Col xs={6}>
          <p>Reçues</p>
          <ul>
            {invites.map(i => (
              <li key={i.friendship}>
                <InviteCard user={i.friend} actionName='Accepter' onAction={onAcceptInvite} />
              </li>)
            )}
          </ul>
        </Col>
        <Col xs={6}>
          <p>En attente</p>
          <ul>
            {pendingInvites.map(i => (
              <li key={i.friendship}>
                <InviteCard user={i.friend} actionName='Annuler' onAction={onCancelInvite} />
              </li>)
            )}
          </ul>
        </Col>
      </Row>

      <div className='text-center pt-5 mt-5'>
        <Button variant="danger" onClick={onLogout} >Déconnexion</Button>
      </div>

    </React.Fragment>
  )
}
