import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useForm, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import useAuth from "../hooks/auth";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";


const Register = () => {

  const { token } = useAuth();
  const navigate = useNavigate();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      lastName: "",
      firstName: "",
    }
  });
  const [isLoading, setLoading] = useState(false);
  const [errorApiStatus, setErrorApiStatus] = useState({});
  const [SuccessApiStatus, setSuccessApiStatus] = useState(false);

  const onSubmit = useCallback((data) => {
    const { email, password, firstName, lastName } = data
    setLoading(true);
    setSuccessApiStatus(false);
    setErrorApiStatus({});

    register(email, password, firstName, lastName)
      .then((data) => {
        setSuccessApiStatus(true)
      })
      .catch(({ response: { data } }) => {
        let message = ""
        Object.keys(data).map((element) => {
          message += `${data[element]} \n`
        })
        setErrorApiStatus(
          {
            "message": message,
          }
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  useEffect(() => {
    if (token) navigate("/")
  }, [token])




  return (
    <Card className="Auth-form-container">
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
              Votre compte a bien été créé, vous allez recevoir un email de confirmation
            </Alert>
          )
        }
        <Form autoComplete={'off'} onSubmit={handleSubmit(onSubmit)}>
          <Row className="mt-3">
            <Form.Group controlId="validationFirstName">
              <Form.Label>Prénom</Form.Label>
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: true,
                  minLength: {
                    value: 1,
                    message: "Veuillez renseigne votre prénom"
                  }
                }}
                render={({ field }) =>
                  <Form.Control
                    {...field}
                    type="text"
                    readOnly={isLoading}
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
              <Form.Label>Nom</Form.Label>
              <Controller
                name="lastName"
                control={control}
                rules={{
                  required: true,
                  minLength: {
                    value: 1,
                    message: "Veuillez renseigne votre nom"
                  }
                }}
                render={({ field }) =>
                  <Form.Control
                    {...field}
                    type="text"
                    readOnly={isLoading}
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
              <Form.Label>Adresse mail</Form.Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Veuillez renseigner une adresse mail valide"
                  }
                }}
                render={({ field }) =>
                  <Form.Control
                    {...field}
                    type="email"
                    readOnly={isLoading}
                  />
                }
              />
              {errors.email && (
                <Form.Text>
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="validationPassword">
              <Form.Label>Mot de passe</Form.Label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: true,
                  minLength: {
                    value: 6,
                    message: "Le mot de passe doit contenir au moins 6 caractères"
                  }
                }}
                render={({ field }) =>
                  <Form.Control
                    {...field}
                    type="password"
                    readOnly={isLoading}
                  />
                }
              />
              {errors.password && (
                <Form.Text>
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>
          </Row>
          <br />
          <Button type="submit" variant="primary" disabled={isLoading} >
            {
              isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : ("Register")
            }
          </Button>
          <br />
          {
            !isLoading && (
              <>
                <Card.Link href="/login">Se connecter</Card.Link>
                <Card.Link href="/reset-password-request">Réinitialiser le mot de passe</Card.Link>
              </>

            )
          }

        </Form>
      </Card.Body>
    </Card>

  );
}
export default Register;