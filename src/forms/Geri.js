import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import GeriAmtForm from 'src/forms/GeriAmtForm'
import GeriEbasDepForm from 'src/forms/GeriEbasDepForm'
import GeriOtConsultForm from 'src/forms/GeriOtConsultForm'
import GeriOtQuestionnaireForm from 'src/forms/GeriOtQuestionnaireForm'
import GeriPhysicalActivityLevelForm from 'src/forms/GeriPhysicalActivityLevelForm'
import GeriPtConsultForm from 'src/forms/GeriPtConsultForm'
import GeriSppbForm from 'src/forms/GeriSppbForm'
import GeriVisionForm from 'src/forms/GeriVisionForm'
import GeriMMSEForm from './GeriMMSEForm'
import GeriAudiometryform from './GeriAudiometryForm'
import GeriAudiometryPreScreeningform from './GeriAudiometryPreScreeningForm'
import { ScrollTopContext } from '../api/utils.js'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
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
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

//const useStyles = makeStyles((theme) => ({
//  root: {
//    flexGrow: 1,
//    backgroundColor: theme.palette.background.paper,
//  },
//}))

const GeriWrapper = styled('div')(
  ({ theme }) => `
  flex-grow: 1
  background-color: $(theme.palette.background.paper);
`,
)

export default function GeriTabs() {
  const [value, setValue] = React.useState(0)
  const { scrollTop } = React.useContext(ScrollTopContext)

  const handleChange = (event, newValue) => {
    scrollTop()
    setValue(newValue)
  }

  return (
    <GeriWrapper>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          aria-label='simple tabs example'
        >
          <Tab label='AMT' {...a11yProps(0)} />
          <Tab label='EBAS' {...a11yProps(1)} />
          <Tab label='MMSE' {...a11yProps(2)} />
          <Tab label='Physical Activity Level' {...a11yProps(3)} />
          <Tab label='OT Questionnaire' {...a11yProps(4)} />
          <Tab label='SPPB' {...a11yProps(5)} />
          <Tab label='PT Consult' {...a11yProps(6)} />
          <Tab label='OT Consult' {...a11yProps(7)} />
          <Tab label='Vision' {...a11yProps(8)} />
          <Tab label='Audiometry Pre-Screening' {...a11yProps(9)} />
          <Tab label='Audiometry' {...a11yProps(10)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <GeriAmtForm changeTab={handleChange} nextTab={1} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GeriEbasDepForm changeTab={handleChange} nextTab={2} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeriMMSEForm changeTab={handleChange} nextTab={3} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GeriPhysicalActivityLevelForm changeTab={handleChange} nextTab={4} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <GeriOtQuestionnaireForm changeTab={handleChange} nextTab={5} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <GeriSppbForm changeTab={handleChange} nextTab={6} />
      </TabPanel>
      <TabPanel value={value} index={6}>
        <GeriPtConsultForm changeTab={handleChange} nextTab={7} />
      </TabPanel>
      <TabPanel value={value} index={7}>
        <GeriOtConsultForm changeTab={handleChange} nextTab={8} />
      </TabPanel>
      <TabPanel value={value} index={8}>
        <GeriVisionForm changeTab={handleChange} nextTab={9} />
      </TabPanel>
      <TabPanel value={value} index={9}>
        <GeriAudiometryPreScreeningform changeTab={handleChange} nextTab={10} />
      </TabPanel>
      <TabPanel value={value} index={10}>
        <GeriAudiometryform changeTab={handleChange} nextTab={11} />
      </TabPanel>
    </GeriWrapper>
  )
}
