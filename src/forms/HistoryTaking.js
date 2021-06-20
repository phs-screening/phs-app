import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HxCancerForm from 'src/forms/HxCancerForm';
import HxHcsrForm from 'src/forms/HxHcsrForm';
import HxNssForm from 'src/forms/HxNssForm';
import HxSocialForm from 'src/forms/HxSocialForm';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function HxTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="HCSR" {...a11yProps(0)} />
          <Tab label="NSS" {...a11yProps(1)} />
          <Tab label="Social" {...a11yProps(2)} />
          <Tab label="Cancer" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <HxHcsrForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HxNssForm />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HxSocialForm />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <HxCancerForm />
      </TabPanel>
    </div>
  );
}
