import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AppBar, Box, Button, Hidden, IconButton, Toolbar } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Logo from './Logo'
import { useEffect, useState } from 'react'
import { getName, getProfile, isLoggedin } from '../services/authSession'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../App.jsx'
import React, { useContext } from 'react'

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const { profile, setProfile } = useContext(LoginContext)
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(false)

  useEffect(() => {
    if (!isLoggedin()) {
      navigate('/login', { replace: true })
      return
    }
    if (!profile) {
      ;(async () => {
        const p = await getProfile()
        if (p) {
          setProfile(p)
          setAdmin(!!p.is_admin)
          localStorage.setItem('profile', JSON.stringify(p))
        }
      })()
    } else {
      setAdmin(!!profile.is_admin)
    }
  }, [profile, navigate, setProfile])

  const name = profile ? getName(profile) : ''

  return (
    <AppBar elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to='/app/registration'>
          <Logo />
        </RouterLink>
        <div style={{ marginLeft: 4 }}>{name}</div>
        {admin && (
          <Button
            color='primary'
            size='large'
            variant='contained'
            component={RouterLink}
            to='/app/manage'
            sx={{ marginLeft: 2 }}
          >
            Manage Volunteers
          </Button>
        )}
        {admin && (
          <Button
            color='primary'
            size='large'
            variant='contained'
            component={RouterLink}
            to='/app/docadmin'
            sx={{ marginLeft: 2 }}
          >
            Doctor PDF
          </Button>
        )}
        {admin && (
          <Button
            color='primary'
            size='large'
            variant='contained'
            component={RouterLink}
            to='/app/formAadmin'
            sx={{ marginLeft: 2 }}
          >
            Form A
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgUp>
          <IconButton color='inherit' onClick={onMobileNavOpen} size='large'>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
}

export default DashboardNavbar
