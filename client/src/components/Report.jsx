import React, { useCallback, useEffect, useState } from 'react'
import { getUser, } from '../api/user';
import { Badge, Table, Card, Button, Modal, Form, Row, Spinner, Alert } from 'react-bootstrap';
import { useForm, Controller } from "react-hook-form";
import {
  getReports, banReportedUser, closeReport,
} from '../api';

import Loader from './Loader'


export default () => {

  const [error, setError] = useState();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = useCallback(() => {
    setIsLoading(true);
    getReports().then(({ data }) => { console.log(data); setReports(data); setIsLoading(false) }).catch((e) => { debugger })
  }, [reports, isLoading])

  useEffect(() => {
    loadReports()
  }, [])

  const onBanReportedUser = (id) => {
    banReportedUser(id)
      .finally(() => {
        loadReports();
      })
  };

  const onCloseReport = (id) => {
    closeReport(id)
      .finally(() => {
        loadReports();
      })
  };

  return (
    <React.Fragment>
      <h2 className='mt-3' >Reports</h2>
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
              </Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Reporter</th>
                      <th>Target</th>
                      <th>isClosed</th>
                      <th>Report date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      reports.map((r) => {
                        return (
                          <tr key={r.id}>
                            <td>{r.reporter.firstName} {r.reporter.lastName}</td>
                            <td>{r.target.firstName} {r.target.lastName}</td>
                            <td>{
                              r.isClosed ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>
                            }</td>
                            <td>{r.createdAt}</td>
                            <td>
                              {!r.isClosed &&
                                (
                                  <React.Fragment>
                                    <Button variant="success" onClick={() => onCloseReport(r.id)}>Close</Button>
                                    <Button variant="danger" onClick={() => onBanReportedUser(r.id)}>BAN</Button>
                                  </React.Fragment>
                                )

                              }
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </React.Fragment>
      }


    </React.Fragment >
  )
}