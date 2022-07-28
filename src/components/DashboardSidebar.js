import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  ShoppingBag as ShoppingBagIcon,
  UserPlus as UserPlusIcon,
} from 'react-feather';
import NavItem from './NavItem';
import { FormContext } from 'src/api/utils';
import { useNavigate } from 'react-router-dom';
import {logOut} from "../services/mongoDB";

const title1 = 'Patient Dashboard';
const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: title1
  },
  {
    href: '/app/registration',
    icon: UserPlusIcon,
    title: 'Change Patient'
  },
  {
    href: '/app/summary',
    icon: ShoppingBagIcon,
    title: 'Patient Summary'
  },
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const {patientId, updatePatientId} = useContext(FormContext);
  const handleLogOut = () => {
      logOut().then(() => navigate('/login', { replace: true })).catch(() => alert("Error Logging Out"))
  }

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        <Typography
          color="textPrimary"
          variant="h5"
        >
          {/*typeof patientId.preRegistrationQ == "undefined" ? "No Patient Selected" : patientInfo.preRegistrationQ.initials*/}
        </Typography>
        <Typography
          color={patientId === -1 ? "textSecondary" : "primary.main"}
          variant={patientId === -1 ? "body2" : "h5"}
        >
          {patientId === -1 ? "No Patient Selected" : "Patient_id " + patientId}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
              shouldDisable={patientId === -1 && item.title === title1}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          backgroundColor: 'background.default',
          m: 2,
          p: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          <Button
            color="primary"
            component="a"
            onClick={()=> handleLogOut()}
            variant="contained"
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default DashboardSidebar;
