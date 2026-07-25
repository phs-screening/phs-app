import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'
import React, { useState, useContext, useEffect } from 'react'
import { ScrollTopContext, FormContext } from '../../api/utils.js'
import useScrollToTopOnChange from '../../hooks/useScrollToTopOnChange.js'
import HxFamilyForm from './HxFamilyForm.jsx'
import HxGynaeForm from './HxGynaeForm.jsx'
import HxHcsrForm from './HxHcsrForm.jsx'
import HxM4M5ReviewForm from './HxM4M5ReviewForm.jsx'
import HxNssForm from './HxNssForm.jsx'
import HxOralForm from './HxOralForm.jsx'
import HxPhqForm from './HxPhqForm.jsx'
import HxScoliosisForm from './HxScoliosisForm.jsx'
import HxSocialForm from './HxSocialForm.jsx'
import HxVaccineForm from './HxVaccineForm.jsx'
import allForms from '../forms.json'
import { getSavedData } from '../../services/patientData'

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

const HxWrapper = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
  background-color: ${theme.palette.background.paper};
`,
)

export default function HxTabs() {
  const [value, setValue] = useState(0)
  const [isFemale, setIsFemale] = useState(false)
  const { scrollTop } = useContext(ScrollTopContext)
  const wrapperRef = useScrollToTopOnChange(value, scrollTop)
  const { patientId } = useContext(FormContext)

  // Fetches regForm data to show hxGynae tab based on whether patient is female or not
  useEffect(() => {
    const fetchData = async () => {
      const registrationData = await getSavedData(patientId, allForms.registrationForm)
      setIsFemale(registrationData?.registrationQ5 === 'Female' ? true : false)
      console.log('isFemale:', registrationData?.registrationQ5)
    }
    fetchData()
  }, [patientId])

  const handleChange = (event, newValue) => {
    scrollTop()
    // If male and trying to go to Gynae (index 5), skip to PHQ (index 5 for males)
    if (!isFemale && newValue === 5) {
      setValue(5) // PHQ tab for males
    } else if (!isFemale && newValue === 6) {
      setValue(6) // M4/M5 Review tab for males
    } else {
      setValue(newValue)
    }
  }

  return (
    <HxWrapper ref={wrapperRef}>
      <AppBar position='static' color='default'>
        <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
          <Tab label='HCSR' {...a11yProps(0)} />
          <Tab label='PMHx' {...a11yProps(1)} />
          <Tab label='Social' {...a11yProps(2)} />
          <Tab label='Oral' {...a11yProps(3)} />
          <Tab label='Family' {...a11yProps(4)} />
          {isFemale && <Tab label='Gynae' {...a11yProps(5)} />}
          <Tab label='PHQ' {...a11yProps(6)} />
          <Tab label='M4/M5 Review' {...a11yProps(7)} />
          <Tab label='Scoliosis' {...a11yProps(8)} />
          <Tab label='Vaccination' {...a11yProps(9)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <HxHcsrForm changeTab={handleChange} nextTab={1} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HxNssForm changeTab={handleChange} nextTab={2} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <HxSocialForm changeTab={handleChange} nextTab={3} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <HxOralForm changeTab={handleChange} nextTab={4} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <HxFamilyForm changeTab={handleChange} nextTab={5} />
      </TabPanel>
      {/* Only show hxGynae form if the patient is female */}
      {isFemale && (
        <TabPanel value={value} index={5}>
          <HxGynaeForm changeTab={handleChange} nextTab={6} />
        </TabPanel>
      )}
      <TabPanel value={value} index={isFemale ? 6 : 5}>
        <HxPhqForm changeTab={handleChange} nextTab={isFemale ? 7 : 6} />
      </TabPanel>
      <TabPanel value={value} index={isFemale ? 7 : 6}>
        <HxM4M5ReviewForm />
      </TabPanel>
      <TabPanel value={value} index={isFemale ? 8 : 7}>
        <HxScoliosisForm changeTab={handleChange} nextTab={isFemale ? 8 : 7} />
      </TabPanel>
      <TabPanel value={value} index={isFemale ? 9 : 8}>
        <HxVaccineForm changeTab={handleChange} nextTab={isFemale ? 9 : 8} />
      </TabPanel>
    </HxWrapper>
  )
}
