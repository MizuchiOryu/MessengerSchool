import React, { useCallback, useEffect, useState } from 'react'
import { getUser,createUser,bannedUser } from '../api/user';
import { Badge, Table, Card, Button,Modal,Form ,Row,Spinner,Alert} from 'react-bootstrap';
import { useForm ,Controller} from "react-hook-form";

import Loader from './Loader'


export default () => {

  const [error, setError] = useState();
  const [listUser, setListUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [FormIsSubmit, setFormIsSubmit] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            lastName:"",
            firstName:"",
            isAdmin:false,
        }
    });

    const [errorApiStatus, setErrorApiStatus] = useState({});
    const [SuccessApiStatus, setSuccessApiStatus] = useState(false);

  const handleCloseModal = useCallback(()=>{
    setShowModal(false);
    loadUsers();
  },[])

  const handleShowModal = () => setShowModal(true);

    const onSubmit = useCallback((data)=>{
    const {email,firstName,lastName,isAdmin} = data 
    setFormIsSubmit(true);
    setSuccessApiStatus(false);
    setErrorApiStatus({});

    createUser(email,firstName,lastName,isAdmin)
      .then((data)=>{
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
        setFormIsSubmit(false);
      });
    },[])

    const onBannedUser = useCallback((id_user)=>{
    
        bannedUser(id_user)
          .then((data)=>{
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
            setFormIsSubmit(false);
          });
        },[])

  const loadUsers = useCallback(()=>{
    setIsLoading(true);
    getUser().then(({ data }) => {setListUser(data); setIsLoading(false)}).catch((e) => { location.href = "/" })
  },[listUser,isLoading])

  useEffect(() => {
    loadUsers()
  }, [])



  return (
    <React.Fragment>
      <h2 className='mt-3' >Moderation</h2>
      {error &&
        (
          <div>
            <Badge bg="danger"> {error} </Badge>
          </div>
        )
      }
      {
        isLoading ? (<Loader />) :
        <React.Fragment>
            <Card className="Auth-form-container">
                <Card.Header>
                    <Button variant="primary" onClick={handleShowModal}>
                        New User
                    </Button>
                </Card.Header>
                <Card.Body>
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
                                Le compte a bien étais crée
                            </Alert>
                        )
                    }
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>isAdmin</th>
                                <th>Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listUser.map((u)=>{
                                    return (
                                        <tr key={u.id}>
                                            <td>{u.firstName}</td>
                                            <td>{u.lastName}</td>
                                            <td>
                                                {
                                                    u.isAdmin ? <Badge bg="success">True</Badge>: <Badge bg="danger">False</Badge>
                                                }
                                            </td>
                                            <td> 
                                                <Button variant="danger" onClick={onBannedUser(u.id)}>X</Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>New user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete={'off'} onSubmit={handleSubmit(onSubmit)}>
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
                                        readOnly={FormIsSubmit}
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
                                        readOnly={FormIsSubmit}
                                    />
                                }
                                />
                                {errors.lastName && (
                                    <Form.Text>
                                    {errors.lastName.message}
                                    </Form.Text>
                                )}
                            </Form.Group>
                            <Form.Group controlId="validationEmail">
                            <Form.Label>Email</Form.Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: true,
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "Entered value does not match email format"
                                        }
                                    }}
                                    render={({ field }) => 
                                    <Form.Control
                                        {...field}
                                        type="email"
                                        readOnly={FormIsSubmit}
                                    />
                                }
                                />
                                {errors.email && (
                                    <Form.Text>
                                    {errors.email.message}
                                    </Form.Text>
                                )}
                            </Form.Group>
                            <Form.Group controlId="validationisAdmin">
                                <Form.Label>isAdmin</Form.Label>
                                <Controller
                                    name="isAdmin"
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field }) => 
                                        <Form.Check
                                            {...field}
                                            type="checkbox"
                                            label="User is Admin ?"
                                            readOnly={FormIsSubmit}
                                        />
                                }
                                />
                                {errors.isAdmin && (
                                    <Form.Text>
                                        {errors.isAdmin.message}
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Row>
                        <br/>
                        <Button type="submit" variant="primary" disabled={FormIsSubmit} >
                                {
                                FormIsSubmit ? (
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                ) : ("Create")
                                }
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

        </React.Fragment>
      }


    </React.Fragment>
  )
}
