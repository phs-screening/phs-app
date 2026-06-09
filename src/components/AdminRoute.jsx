import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { LoginContext } from '../App.jsx'
import { getProfile } from '../services/authSession'

const AdminRoute = ({ children, redirectTo = '/app/registration' }) => {
  const { setProfile } = useContext(LoginContext)
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    let active = true

    const checkAdmin = async () => {
      const profile = await getProfile()

      if (!active) return

      if (profile) {
        setProfile(profile)
        localStorage.setItem('profile', JSON.stringify(profile))
      }

      setAllowed(Boolean(profile?.is_admin))
    }

    checkAdmin()

    return () => {
      active = false
    }
  }, [setProfile])

  if (allowed === null) {
    return null
  }

  if (!allowed) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
}

export default AdminRoute
