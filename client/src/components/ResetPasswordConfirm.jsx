import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useForm, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import useAuth from "../hooks/auth";
import { verifyResetPassword, resetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";


const ResetPasswordConfirm = () => {

  const { token } = useAuth();
  const navigate = useNavigate();

  const { handleSubmit, control, formState: { errors }, watch } = useForm({
    defaultValues: {
      password: "",
      password_repeat: "",
    }
  });
  const password = useRef({});
  password.current = watch("password", "");

  const [temporyToken, setTemporyToken] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const [isLoadingVerify, setLoadingVerify] = useState(true);
  const [errorApiStatus, setErrorApiStatus] = useState({});
  const [SuccessApiStatus, setSuccessApiStatus] = useState(false);

  const onSubmit = useCallback((data) => {
    const { password } = data
    setLoading(true);
    setSuccessApiStatus(false);
    setErrorApiStatus({});

    resetPassword(temporyToken, password)
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
  }, [temporyToken])

  const verifyToken = useCallback(() => {
    if (temporyToken) {
      verifyResetPassword(temporyToken)
        .then((data) => {
          setLoadingVerify(false);
        })
        .catch(() => {
          navigate("/login")
        });
    }
  }, [token, temporyToken, isLoadingVerify])

  useEffect(() => {
    if (token) navigate("/")
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    let tokenParams = urlParams.get('token');
    if (!tokenParams) navigate("/login");
    setTemporyToken(tokenParams);
    verifyToken()
  }, [token, temporyToken])




  return (
    <Card className="Auth-form-container">
      <Card.Body>
        {
          isLoadingVerify ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) :
            <>
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
                    Votre mot de passe a bien été modifié, vous allez être redirigé vers la page de connexion
                  </Alert>
                )
              }
              <Form autoComplete={'off'} onSubmit={handleSubmit(onSubmit)}>
                <Row className="mt-3">
                  <Form.Group controlId="validationPassword">
                    <Form.Label>Nouveau mot de passe</Form.Label>
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
                  <Form.Group controlId="validationRepeatPassword">
                    <Form.Label>Répétez le nouveau mot de passe</Form.Label>
                    <Controller
                      name="password_repeat"
                      control={control}
                      rules={{
                        required: true,
                        minLength: {
                          value: 6,
                          message: "Le mot de passe doit contenir au moins 6 caractères"
                        },
                        validate: (value) => value === password.current || "Les mots de passe sont différents"
                      }}
                      render={({ field }) =>
                        <Form.Control
                          {...field}
                          type="password"
                          readOnly={isLoading}
                        />
                      }
                    />
                    {errors.password_repeat && (
                      <Form.Text>
                        {errors.password_repeat.message}
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
                    ) : ("Réinitialiser le mot de passe")
                  }
                </Button>
                <br />
                {
                  !isLoading && (
                    <>
                      <Card.Link href="/login">Se connecter</Card.Link>
                      <Card.Link href="/reset-password">Réinitialiser le mot de passe</Card.Link>
                    </>

                  )
                }

              </Form>
            </>
        }
      </Card.Body>
    </Card>

  );
}
export default ResetPasswordConfirm;