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
import {useContext, useState} from "react";
import {LoginContext} from "../App";
import mongoDB from "../services/mongoDB";

const DashboardNavbar = ({ onMobileNavOpen, ...rest }) => {
  console.log('');
  const login = useContext(LoginContext);
  const [name, setName] = useState(mongoDB.currentUser === null
  ? "You are not logged in! Changes will not be saved!"
  : mongoDB.currentUser.profile.name)


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
        <Button
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            href="/app/manage"
            sx={{marginLeft: 2}}
        >
          Manage Volunteers
        </Button>
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
