import React, {useEffect, useRef, useState} from 'react'
import useAuth from '../hooks/auth';

import Button from 'react-bootstrap/Button';
import { acceptInvite, cancelInvite, deleteFriend, getFriends, getInvites, getPendingInvites, sendFriendRequest } from '../api';import {Badge, Col, Row} from 'react-bootstrap';

import InviteCard from './InviteCard'

export default () => {
  const { onLogout } = useAuth();

  const [error, setError] = useState()
  const inputRef = useRef()

  const [ friends, setFriends ] = useState([])
  const [ pendingInvites, setPendingInvites ] = useState([])
  const [ invites, setInvites ] = useState([])


  const loadFriends = () => {
    getFriends().then(({data}) => setFriends(data)).catch((e)=>{debugger})
  }

  const loadPendingInvites = () => {
    getPendingInvites().then(({data}) => setPendingInvites(data)).catch((e)=>{debugger})
  }

  const loadInvites = () => {
    getInvites().then(({data}) => setInvites(data)).catch((e)=>{debugger})
  }

  const loadData = () => {
    loadFriends()
    loadInvites()
    loadPendingInvites()
  }

  useEffect(() => {
    loadData()
  }, [])

  const sendRequest = (e) => {
    e.preventDefault()

    const friendId = Number(inputRef.current.value)

    if ( isNaN(friendId)) {
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
      .then(({data}) => {})
      .catch((e)=>{debugger})
      .finally(() => loadData())
  }

  const onCancelInvite = (friendId) => {
    cancelInvite(friendId)
      .then(({data}) => {})
      .catch((e)=>{debugger})
      .finally(() => loadData())
  }

  const OnDeleteFriend = (friendId) => {
    deleteFriend(friendId)
      .then(({data}) => {})
      .catch((e)=>{debugger})
      .finally(() => loadData())
  }

  return (
    <React.Fragment>
      <h2 className='mt-3' >Ajouter un ami</h2>
      { error && 
          (
            <div>
              <Badge  bg="danger"> {error} </Badge>
            </div>
          )
      }
      <input type='text' ref={inputRef}></input>
      <Button onClick={sendRequest}>Ajouter</Button>

      <h2 className='mt-3' >Mes amis</h2>
      <ul>
        { friends.map(f => (
          <li key={f.friendship}>
            <div className='d-flex align-items-center'>
              <span className="me-2">{`${f.friend.firstName} ${f.friend.lastName}`}</span>
              <Button
                variant='danger'
                onClick={() => OnDeleteFriend(f.friend.id)}>Supprimer</Button>
            </div>
          </li>)
        ) }
      </ul>

      <h2>Mes invitations</h2>
      <Row>
        <Col xs={6}>
          <p>Reçues</p>
          <ul>
            { invites.map(i => (
              <li key={i.friendship}>
                <InviteCard  user={i.friend} actionName='Accepter' onAction={onAcceptInvite} />
              </li>)
            ) }
          </ul>
        </Col>
        <Col xs={6}>
          <p>En attente</p>
          <ul>
            { pendingInvites.map(i => (
              <li key={i.friendship}>
                <InviteCard  user={i.friend} actionName='Annuler' onAction={onCancelInvite} />
              </li>)
            ) }
          </ul>
        </Col>
      </Row>

      <div className='text-center pt-5 mt-5'>
      <Button variant="danger" onClick={onLogout} >Déconnexion</Button>
      </div>

    </React.Fragment>
  )
}