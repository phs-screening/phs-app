import React from 'react'
import { Navigate } from 'react-router-dom'
import { isLoggedin } from '../services/authSession'

const DefaultRoute = () => (
  <Navigate to={isLoggedin() ? '/app/registration' : '/login'} replace />
)

export default DefaultRoute
