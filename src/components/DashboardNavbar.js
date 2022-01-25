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

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  console.log('');
  const [profile, setProfile] = useState(undefined)
  const [admin, isAdmin] = useState(false)
  const [name, setName] = useState(isLoggedin()
  ? getName()
  : "You are not logged in! Changes will not be saved!")

  useEffect(async () => {
    const profile = await getProfile()
    setProfile(profile)
    isAdmin(profile.is_admin)
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

        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <IconButton color="inherit">
            <InputIcon />
          </IconButton>
        </Hidden>
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
