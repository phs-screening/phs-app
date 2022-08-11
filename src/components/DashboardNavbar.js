import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box, Button,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import Logo from './Logo';
import {useEffect, useState} from "react";
import {getName, getProfile, isLoggedin} from "../services/mongoDB";
import { useNavigate } from 'react-router-dom';
import {deleteFromAllDatabase} from "../api/api";

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  const navigate = useNavigate()
  const notLoggedIn = () => {
    navigate('/login', { replace: true })
    alert("You are not logged In!")
  }
  const [profile, setProfile] = useState(undefined)
  const [admin, isAdmin] = useState(false)
  const [name, setName] = useState(isLoggedin()
  ? getName()
  : notLoggedIn())

  useEffect(async () => {
    const profile = await getProfile()
    setProfile(profile)
    if (profile !== null) {
      isAdmin(profile.is_admin)
    }
  }, [])


  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/app/dashboard">
          <Logo />
        </RouterLink>
        <div style={{marginLeft: 4,}}>
          {name}
        </div>
        {admin && <Button
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            href="/app/manage"
            sx={{marginLeft: 2}}
        >
          Manage Volunteers
        </Button>}
        {admin && <Button
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            href="/app/edit"
            sx={{marginLeft: 2}}
        >
          Edit Forms
        </Button>}

        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default DashboardNavbar;
