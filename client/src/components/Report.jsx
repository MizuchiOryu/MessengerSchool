import React, { useEffect, useState, useCallback, useRef } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import { useForm, Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import useAuth from "../hooks/auth";
import { useNavigate } from "react-router-dom";
import { getReports, closeReport, banReportedUser } from '../api';


const Register = () => {

  const { token } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [errorApiStatus, setErrorApiStatus] = useState({});
  const [SuccessApiStatus, setSuccessApiStatus] = useState(false);

  const [reports, setReports] = useState([]);

  const loadReports = () => {
    getReports().then(({ data }) => setReports(data)).catch((e) => { debugger })
  }

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

  useEffect(() => {
    loadReports()
  }, [])

  const OnCloseReport = (id) => {
    closeReport(id)
      .then(() => {
        loadReports()
      }
      )
      .catch((e) => { debugger })
  }

  const OnBanUser = (id) => {
    banReportedUser(id)
      .then(() => {
        loadReports()
      }
      )
      .catch((e) => { debugger })
  }

  return (
    <React.Fragment>
      <h2>Tous les rapports</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Émetteur</th>
            <th>Cible</th>
            <th>Raison</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            return (
              <tr key={report.id}>
                <td>{report.reporter}</td>
                <td>{report.target}</td>
                <td>{report.reason}</td>
                <td>
                  <Button variant="success" onClick={() => OnCloseReport(report.id)}>Clôturer le rapport</Button>
                  <Button variant="danger" onClick={() => OnBanUser(report.id)}>Bloquer la cible</Button>
                </td>
              </tr>
            )
          }
          )}
        </tbody>
      </Table>

      <div className='text-center pt-5 mt-5'>
        <Button variant="danger" onClick={onLogout} >Déconnexion</Button>
      </div>

    </React.Fragment >

  );
}
export default Register;
