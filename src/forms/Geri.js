import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import GeriAmtForm from './GeriAmtForm';
import GeriEbasDepForm from './GeriEbasDepForm';
import GeriVisionForm from './GeriVisionForm';
import GeriParQForm from './GeriParQForm';
import GeriPhysicalActivityLevelForm from './GeriPhysicalActivityLevelForm';

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

export default function GeriTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="AMT" {...a11yProps(0)} />
          <Tab label="Ebas Dep" {...a11yProps(1)} />
          <Tab label="Vision" {...a11yProps(2)} />
          <Tab label="ParQ" {...a11yProps(3)} />
          <Tab label="Physical Activity Level" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <GeriAmtForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GeriEbasDepForm />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeriVisionForm />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GeriParQForm />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <GeriPhysicalActivityLevelForm />
      </TabPanel>
    </div>
  );
}
