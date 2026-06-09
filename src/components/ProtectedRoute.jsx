import React from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { isLoggedin } from '../services/authSession'

const ProtectedRoute = ({ children }) => {
  if (!isLoggedin()) {
    return <Navigate to='/login' replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
