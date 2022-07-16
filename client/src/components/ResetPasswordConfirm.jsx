import React, { useEffect, useState,useCallback, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { useForm ,Controller} from "react-hook-form";
import { Form } from "react-bootstrap";
import useAuth from "../hooks/auth";
import { verifyResetPassword,resetPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";


const ResetPasswordConfirm = () => {

    const { token } = useAuth();
    const navigate = useNavigate();

    const { handleSubmit, control, formState: { errors },watch } = useForm({
        defaultValues: {
          password: "",
          password_repeat:"",
        }
    });
    const password = useRef({});
    password.current = watch("password", "");

    const [temporyToken , setTemporyToken] = useState(null);

    const [isLoading,setLoading] = useState(false);
    const [isLoadingVerify,setLoadingVerify] = useState(true);
    const [errorApiStatus, setErrorApiStatus] = useState({});
    const [SuccessApiStatus, setSuccessApiStatus] = useState(false);

    const onSubmit = useCallback((data)=>{
        const {password} = data 
        setLoading(true);
        setSuccessApiStatus(false);
        setErrorApiStatus({});

        resetPassword(temporyToken,password)
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
            setLoading(false);
          });
    },[temporyToken])

    const verifyToken = useCallback(()=>{
        if (temporyToken) {
          verifyResetPassword(temporyToken)
            .then((data)=>{
              setLoadingVerify(false);
            })
            .catch(()=>{
              navigate("/login")
            });
      }
    },[token,temporyToken,isLoadingVerify])

    useEffect(()=>{
      if(token) navigate("/")
      const queryString = location.search;
      const urlParams = new URLSearchParams(queryString);
      let tokenParams = urlParams.get('token');
      if(!tokenParams) navigate("/login");
      setTemporyToken(tokenParams);
      verifyToken()
    },[token,temporyToken])
  
    


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
                Votre mot de passe a bien étais modifié vous allez etre rediriger vers la page d'authentification
              </Alert>
            )
          }
          <Form autoComplete={'off'} onSubmit={handleSubmit(onSubmit)}>
            <Row className="mt-3">
              <Form.Group controlId="validationPassword">
                <Form.Label>Password</Form.Label>
                  <Controller
                      name="password"
                      control={control}
                      rules={{
                          required: true,
                          minLength: {
                              value: 6,
                              message: "password min length is 6"
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
                <Form.Label>RepeatPassword</Form.Label>
                  <Controller
                      name="password_repeat"
                      control={control}
                      rules={{
                          required: true,
                          minLength: {
                              value: 6,
                              message: "password min length is 6"
                          },
                          validate: (value) => value === password.current || "The passwords do not match"
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
            <br/>
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
            <br/>
            {
              !isLoading && (
                <>
                  <Card.Link href="/login">Login</Card.Link>
                  <Card.Link href="/reset-password">Reset Password</Card.Link>
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