import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/auth';
import { useForm ,Controller} from "react-hook-form";
import {
  acceptInvite, cancelInvite, deleteFriend, getFriends, getInvites, getPendingInvites,
  sendFriendRequest, getReports, reportFriend
} from '../api';
import {editProfile,addTag,removeTag,all_tags,randomTags} from "../api/user";
import {Badge, Col, Row,Alert,Button,Container,Card,Form,Table,InputGroup,Spinner} from 'react-bootstrap';

import InviteCard from './InviteCard'

export default () => {
  const { onLogout,user,onRefreshUser} = useAuth();

  const [error, setError] = useState()
  const inputRef = useRef()

  const [friends, setFriends] = useState([])
  const [pendingInvites, setPendingInvites] = useState([])
  const [invites, setInvites] = useState([])
  const [reports, setReports] = useState([])
  const [ isLoadingApi, setIsLoadingApi ] = useState(false)
  const [ isEdited, setIsEdited ] = useState(false)
  const [ tagSelected, setTagSelected ] = useState("")
  const [ listUserRecommend, setListUserRecommend ] = useState([])
  const [ listTags, setListTags ] = useState([])

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName:"",
      bio: "",
    }
  });

  const [errorApiStatus, setErrorApiStatus] = useState({});
  const [SuccessApiStatus, setSuccessApiStatus] = useState(false);

  const onModifyAccount = useCallback((data)=>{
    const {bio,firstName,lastName} = data
    setIsLoadingApi(true) 
    setSuccessApiStatus(false);
    setErrorApiStatus({});

    editProfile(firstName,lastName,bio)
      .then((data)=>{
        onRefreshUser()
        setSuccessApiStatus(true)
      })
      .catch(({response:{data}})=>{
        let message = ""
        Object.keys(data).map((element)=>{
          message += `${data[element]} \n`
        })
        setErrorApiStatus(
          {
            "message":message,
          }
        );
      })
      .finally(()=>{
        setIsLoadingApi(false);
      });
},[])
  
  const handleEditProfile = useCallback(()=>{
    setIsEdited(true)
  },[])

  const handleCalcelEditProfile = useCallback(()=>{
    setIsEdited(false)
    let {firstName,lastName,bio} = user
    reset({firstName,lastName,bio})
  },[])

  const onChangeTagAdd = useCallback((e)=>{
    e.preventDefault()
    let value = e.target.value
    setTagSelected(value)
  },[])

  const onAddTag = useCallback((event)=>{
    event.preventDefault()
    if(tagSelected === null) return ;
    setSuccessApiStatus(false);
    setErrorApiStatus({});

    addTag(tagSelected)
      .then((data)=>{
        onRefreshUser()
        setSuccessApiStatus(true)
      })
      .catch((error)=>{
        let message = "L'action d'ajout du tag a échoue";
        setErrorApiStatus(
          {
            "message":message,
          }
        );
      })
  },[tagSelected])

  const onDeleteTag = useCallback((tag)=>{
    setSuccessApiStatus(false);
    setErrorApiStatus({});
    removeTag(tag)
      .then(()=>{
        onRefreshUser()
        setSuccessApiStatus(true)
      })
      .catch((error)=>{
        let message = "L'action de suppression du tag a échoue"
        setErrorApiStatus(
          {
            "message":message,
          }
        );
      });
  },[])

  const loadListTags = () => {
    all_tags().then(({data}) => {
      setListTags(data)
      if(data.length > 0) setTagSelected(data[0]?.name)
    }).catch((e)=>{debugger})
    
  }

  const loadListUserRecommend = useCallback(()=>{
    let tagsUser = user.tags.map((t)=>(t.name))
    let tagRandom = tagsUser[Math.floor(Math.random()*tagsUser.length)] ?? null
    randomTags(tagRandom)
    .then(({data}) => {
      if(data){
        setListUserRecommend(data)
      }
      }).catch((e)=>{debugger})
  },[user])

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
    if(user?.id){
      let {firstName,lastName,bio} = user
      reset({firstName,lastName,bio})
      
     Promise.all(
        [
          loadFriends(),
          loadInvites(),
          loadPendingInvites(),
          loadListTags()
        ]
      ).then(()=>(loadListUserRecommend()))
      
    }
    
  }

  useEffect(() => {
    loadData()
  }, [user])


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

  const quickAdd = (e) => {
    e.preventDefault()
    sendFriendRequest(e.target.value)
    .then()
    .catch((e) => {
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

  const OnReportFriend = (target) => {
    reportFriend(target)
      .catch((e) => { debugger })
      .finally(() => loadData())
  }
  return (
    <React.Fragment>
      <Container>
        <br/>
        {
          user?.id && (
            <>
              <Row>
                {
                  errorApiStatus?.message && (
                    <Alert key="danger" variant="danger">
                      {errorApiStatus?.message}
                    </Alert>
                  )
                }
                {
                  SuccessApiStatus && (
                    <Alert key="success" variant="success">
                      La modification de votre profile a bien étais prise en compte
                    </Alert>
                  )
                }
                <Col sm={8}>
                  <Card>
                    <Card.Header>Information</Card.Header>
                    <Card.Body>
                      <Form autoComplete={'off'} onSubmit={handleSubmit(onModifyAccount)}>
                        <Row className="mt-3">
                          <Form.Group controlId="validationFirstName">
                            <Form.Label>FirstName</Form.Label>
                              <Controller
                                  name="firstName"
                                  control={control}
                                  rules={{
                                      required: true,
                                      minLength: {
                                          value: 1,
                                          message: "Please insert your first name"
                                      }
                                  }}
                                  render={({ field }) => 
                                  <Form.Control
                                      {...field}
                                      type="text"
                                      readOnly={isLoadingApi || !isEdited}
                                  />
                              }
                              />
                              {errors.firstName && (
                                  <Form.Text>
                                    {errors.firstName.message}
                                  </Form.Text>
                              )}
                          </Form.Group>
                          <Form.Group controlId="validationLastName">
                            <Form.Label>lastName</Form.Label>
                              <Controller
                                  name="lastName"
                                  control={control}
                                  rules={{
                                      required: true,
                                      minLength: {
                                          value: 1,
                                          message: "Please insert your lastName"
                                      }
                                  }}
                                  render={({ field }) => 
                                  <Form.Control
                                      {...field}
                                      type="text"
                                      readOnly={isLoadingApi || !isEdited}
                                  />
                              }
                              />
                              {errors.lastName && (
                                  <Form.Text>
                                    {errors.lastName.message}
                                  </Form.Text>
                              )}
                          </Form.Group>
                          <Form.Group controlId="validationBio">
                            <Form.Label>Bio</Form.Label>
                              <Controller
                                  name="bio"
                                  control={control}
                                  render={({ field }) => 
                                  <Form.Control
                                      {...field}
                                      as="textarea"
                                      readOnly={isLoadingApi || !isEdited}
                                  />
                              }
                              />
                              {errors.bio && (
                                  <Form.Text>
                                    {errors.bio.message}
                                  </Form.Text>
                              )}
                          </Form.Group>
                        </Row>
                        <br/>
                        {
                          isEdited ?
                          (
                            
                            <>
                              {
                                isLoadingApi && 
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              }
                              <Button type="submit" variant="success" disabled={isLoadingApi && isEdited} >Modifié</Button>
                              <Button variant="info" onClick={handleCalcelEditProfile} disabled={isLoadingApi && isEdited} >Cancel les modification</Button>
                            </>
                          )
                          :
                          <Button variant="info" onClick={handleEditProfile} >Modifier mon profile</Button>
                        }
                      </Form>
                    </Card.Body>
                    <Card.Footer>
                      <Button variant="danger" onClick={onLogout} >Déconnexion</Button>
                    </Card.Footer>

                  </Card>
                </Col>
                <Col sm={4}>
                  <Row>
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

                    <h2 className='mt-3'>Mes amis</h2>
                    <ul>
                      { friends.map(f => (
                        <li key={f.friendship}>
                          <div className='d-flex align-items-center'>
                            <span className="me-2">{`${f.friend.firstName} ${f.friend.lastName}`}</span>
                            <Button>
                              <Link className='text-white' to={`/chat/${f.friendship}`}>Discuter</Link>
                            </Button>
                            <Button
                              className='ms-2'
                              variant='danger'
                              onClick={() => OnDeleteFriend(f.friend.id)}>Supprimer
                            </Button>
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
                  </Row>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col>
                  <Card>
                    <Card.Header>
                      Mes tags
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            user?.tags.map((u)=>{
                                return (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td> 
                                            <Button variant="danger" onClick={() => onDeleteTag(u.name)}>X</Button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                      </Table>
                    </Card.Body>
                    <Card.Footer>
                      <InputGroup className="mb-3">
                          <Form.Select onChange={onChangeTagAdd} value={tagSelected}>
                            {
                              listTags.map((t)=>{
                                return (
                                  <option key={t.id} value={t.name}>{t.name}</option>
                                )
                              })
                            }
                          </Form.Select>
                          <Button variant="danger" onClick={onAddTag} >Add Tag</Button>
                        </InputGroup> 
                    </Card.Footer>
                  </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>Recommandation selon vos tags</Card.Header>
                        <Card.Body>
                            <ul>
                              { listUserRecommend.map(u => (
                                <li key={u.id}>
                                  {u.firstName} {u.lastName}
                                  <Button value={u.id} onClick={quickAdd}>+</Button>
                                </li>)
                              ) }
                            </ul>
                            </Card.Body>
                    </Card>
                </Col>
              </Row>  
            </>
          )
        }
    </Container>

    </React.Fragment>
  )
}
