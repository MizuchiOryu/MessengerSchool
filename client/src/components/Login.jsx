import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useForm, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import useAuth from "../hooks/auth";
import { useNavigate } from "react-router-dom";


const Login = () => {

  const { token, onLogin } = useAuth();
  const navigate = useNavigate();

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });
  const [isLoading, setLoading] = useState(false);
  const [errorApiStatus, setErrorApiStatus] = useState({});

  const onSubmit = useCallback((data) => {
    const { email, password } = data
    setLoading(true);
    setErrorApiStatus({});
    onLogin(email, password)
      .then(() => {
        location.href = "/"
      })
      .catch(({ response: { data } }) => {
        const { message } = data
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
        <Form autoComplete={'off'} onSubmit={handleSubmit(onSubmit)}>
          <Row className="mt-3">
            <Form.Group controlId="validationEmail">
              <Form.Label>Adresse mail</Form.Label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Veuillez renseigner une adresse email valide"
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
              ) : ("Se connecter")
            }
          </Button>
          <br />
          {
            !isLoading && (
              <>
                <Card.Link href="/register">S'inscrire</Card.Link>
                <Card.Link href="/reset-password-request">Réinitialiser le mot de passe</Card.Link>
              </>

            )
          }

        </Form>
      </Card.Body>
    </Card>

  );
}
export default Login;
