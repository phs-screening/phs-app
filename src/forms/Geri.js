import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import GeriAmtForm from 'src/forms/GeriAmtForm';
import GeriEbasDepForm from 'src/forms/GeriEbasDepForm';
import GeriFrailScaleForm from 'src/forms/GeriFrailScaleForm'; //not working yet
import GeriGeriApptForm from 'src/forms/GeriGeriApptForm';
import GeriOtConsultForm from 'src/forms/GeriOtConsultForm';
import GeriOtQuestionnaireForm from 'src/forms/GeriOtQuestionnaireForm';
import GeriParQForm from 'src/forms/GeriParQForm';
import GeriPhysicalActivityLevelForm from 'src/forms/GeriPhysicalActivityLevelForm';
import GeriPtConsultForm from 'src/forms/GeriPtConsultForm';
import GeriSppbForm from 'src/forms/GeriSppbForm';
import GeriTugForm from 'src/forms/GeriTugForm';
import GeriVisionForm from 'src/forms/GeriVisionForm';

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
        <Tabs value={value} onChange={handleChange} variant="scrollable" aria-label="simple tabs example">
          <Tab label="AMT" {...a11yProps(0)} />
          <Tab label="Ebas Dep" {...a11yProps(1)} />
          <Tab label="Vision" {...a11yProps(2)} />
          <Tab label="ParQ" {...a11yProps(3)} />
          <Tab label="Physical Activity Level" {...a11yProps(4)} />
          <Tab label="Frail Scale" {...a11yProps(5)} />
          <Tab label="OT Questionnaire" {...a11yProps(6)} />
          <Tab label="SPPB" {...a11yProps(7)} />
          <Tab label="TUG" {...a11yProps(8)} />
          <Tab label="PT Consult" {...a11yProps(9)} />
          <Tab label="OT Consult" {...a11yProps(10)} />
          <Tab label="Geri Appointment" {...a11yProps(11)} />
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
      <TabPanel value={value} index={5}>
        <GeriFrailScaleForm />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <GeriOtQuestionnaireForm />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <GeriSppbForm />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <GeriTugForm />
      </TabPanel>
      <TabPanel value={value} index={9}>
        <GeriPtConsultForm />
      </TabPanel>
      <TabPanel value={value} index={10}>
        <GeriOtConsultForm />
      </TabPanel>
      <TabPanel value={value} index={11}>
        <GeriGeriApptForm />
      </TabPanel>
    </div>
  );
}
