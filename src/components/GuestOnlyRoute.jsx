import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { isLoggedin } from '../services/authSession'

const GuestOnlyRoute = ({ children }) => {
  if (isLoggedin()) {
    return <Navigate to='/app/registration' replace />
  }

  return children
}

GuestOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default GuestOnlyRoute
