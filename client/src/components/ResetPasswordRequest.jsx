import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useForm, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import useAuth from "../hooks/auth";
import { requestResetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";


const ResetPasswordRequest = () => {

  const { token } = useAuth();
  const navigate = useNavigate();

  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
    }
  });
  const [isLoading, setLoading] = useState(false);
  const [errorApiStatus, setErrorApiStatus] = useState({});
  const [SuccessApiStatus, setSuccessApiStatus] = useState(false);

  const onSubmit = useCallback((data) => {
    const { email } = data
    setLoading(true);
    setSuccessApiStatus(false);
    setErrorApiStatus({});

    requestResetPassword(email)
      .then((data) => {
        setSuccessApiStatus(true)
      })
      .catch(({ response: { data } }) => {
        let { message } = data
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
              Votre demande de changement de mot de passe a été prise en compte, vous allez être redirigé vers la page de connexion
            </Alert>
          )
        }
        <Form autoComplete={'off'} onSubmit={handleSubmit(onSubmit)}>
          <Row className="mt-3">
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
              ) : ("Reset Password")
            }
          </Button>
          <br />
          {
            !isLoading && (
              <>
                <Card.Link href="/register">Register</Card.Link>
                <Card.Link href="/login">Login</Card.Link>
              </>

            )
          }

        </Form>
      </Card.Body>
    </Card>

  );
}
export default ResetPasswordRequest;