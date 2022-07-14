import React, { useEffect, useState,useCallback, useRef } from "react";
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import useAuth from "../hooks/auth";
import {verify} from "../api/auth";
import { useNavigate } from "react-router-dom";




const Verify = () => {

    const { token } = useAuth();
    const navigate = useNavigate();


    const [isLoading,setLoading] = useState(true);
    const [temporyToken , setTemporyToken] = useState(null);
    const [errorApiStatus, setErrorApiStatus] = useState(false);
    const [successApiStatus, setSuccessApiStatus] = useState(false);

    const onVerify = useCallback(()=>{
        if(temporyToken){
          verify(temporyToken)
            .then((data)=>{
                setSuccessApiStatus(true)
            })
            .catch((error)=>{
                setErrorApiStatus(true);
            })
            .finally(()=>{
                setLoading(false);
                if(successApiStatus) {
                    setTimeout(()=>{
                        navigate("/login")
                    },3000)
                }
            });
        }
        
    },[token,temporyToken,successApiStatus]);

    useEffect(()=>{
        if(token) navigate("/")
        const queryString = location.search;
        const urlParams = new URLSearchParams(queryString);
        let tokenParams = urlParams.get('token');
        if(!tokenParams) navigate("/login");
        setTemporyToken(tokenParams);
        onVerify();
    },[token,temporyToken])
  
    


  return (
    <Card>
      <Card.Body>
        {
            isLoading && (
                <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                />
            )
        }
        {
          errorApiStatus && (
            <Alert key="danger" variant="danger">
                Votre compte a deja étais activer
            </Alert>
          )
        }
        {
          successApiStatus && (
            <Alert key="danger" variant="danger">
                Votre compte est activé vous allez etre rediriger vers la page d'authentification
            </Alert>
          )
        }
      </Card.Body>
    </Card>
    
  );
}
export default Verify;