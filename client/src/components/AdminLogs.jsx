import React, { useEffect, useState } from "react"
import Container from "react-bootstrap/Container";
import { getAdminLogs } from "../api";


export default function AdminLogs() {

  const [ logs, setLogs ] = useState([])

  useEffect(() => {
    getAdminLogs().then(( {data: _logs} ) => setLogs(_logs)).catch((e) => {debugger})
  }, [])

  return (
    <Container>
      <h1 className='text-center my-3' >Logs</h1>
      <div>
        { logs.map((log, i) => (
          <React.Fragment>
            <h6>{ log.level.toUpperCase() }</h6>
            <p>Message: { log.message }</p>
            <div className="d-flex justify-content-around mt-2">
                <div className='text-center'>
                  <strong>Occurences</strong>
                  <p>{log.occurences}</p>
                </div>
                <div className='text-center'>
                  <strong>Pourcentage</strong>
                  <p>{log.percent}%</p>
                </div>
            </div>
            <hr/>
          </React.Fragment>
        ) ) }
      </div>
    </Container>
  )

}
