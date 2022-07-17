import { Button } from "react-bootstrap";
import React from "react";


export default function InviteCard({user, onAction, actionName}){

  return (
    <div className='d-flex align-items-center'>
      <span className="me-2">{`${user.firstName} ${user.lastName}`}</span>
      <Button
        variant={actionName === 'Accepter' ? "success" : 'secondary'}
        onClick={() => onAction(user.id)}>{actionName}</Button>
    </div>
  )
}
