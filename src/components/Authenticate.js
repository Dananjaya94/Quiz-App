import React, { useState } from 'react'
import useStateContext from '../hooks/useStateContext'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';

export default function Authenticate() {

    const {context} = useStateContext();

  return (
    context.participantId === 0
    ? <Navigate to = '/'/>
    : <Outlet/>
  )
}
