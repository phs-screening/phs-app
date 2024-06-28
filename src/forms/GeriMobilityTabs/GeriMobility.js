import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ScrollTopContext } from '../../api/utils.js'
import GeriPhysicalActivityLevelForm from './GeriPhysicalActivityLevelForm.js'
import GeriOtQuestionnaireForm from './GeriOtQuestionnaireForm.js'
import GeriSppbForm from './GeriSppbForm.js'
import GeriPtConsultForm from './GeriPtConsultForm.js'
import GeriOtConsultForm from './GeriOtConsultForm.js'

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

const GeriMobilityWrapper = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
  background-color: $(theme.palette.background.paper);
`,
)

export default function GeriMobilityTabs() {
  const [value, setValue] = React.useState(0)
  const { scrollTop } = React.useContext(ScrollTopContext)

  const handleChange = (event, newValue) => {
    scrollTop()
    setValue(newValue)
  }

  return (
    <GeriMobilityWrapper>
      <AppBar position='static' color='default'>
        <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
          <Tab label='Physical Activity Level' {...a11yProps(0)} />
          <Tab label='Homefast' {...a11yProps(1)} />
          <Tab label='SPPB' {...a11yProps(2)} />
          <Tab label='PT Consult' {...a11yProps(3)} />
          <Tab label='OT Consult' {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <GeriPhysicalActivityLevelForm changeTab={handleChange} nextTab={1} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GeriOtQuestionnaireForm changeTab={handleChange} nextTab={2} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeriSppbForm changeTab={handleChange} nextTab={3} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <GeriPtConsultForm changeTab={handleChange} nextTab={4} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <GeriOtConsultForm />
      </TabPanel>
    </GeriMobilityWrapper>
  )
}
