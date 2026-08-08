import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { styled } from '@mui/system'
import React, { useState, useContext, useEffect } from 'react'
import { ScrollTopContext, FormContext } from '../../api/utils.js'
import LazyTabPanel from '../../components/form-components/LazyTabPanel.jsx'
import useScrollToTopOnChange from '../../hooks/useScrollToTopOnChange.js'
import HxFamilyForm from './HxFamilyForm.jsx'
import HxGynaeForm from './HxGynaeForm.jsx'
import HxHcsrForm from './HxHcsrForm.jsx'
import HxM4M5ReviewForm from './HxM4M5ReviewForm.jsx'
import HxNssForm from './HxNssForm.jsx'
import HxOsaForm from './HxOsaForm.jsx'
import HxOralForm from './HxOralForm.jsx'
import HxPhqForm from './HxPhqForm.jsx'
import HxScoliosisForm from './HxScoliosisForm.jsx'
import HxSocialForm from './HxSocialForm.jsx'
import allForms from '../forms.json'
import { getSavedData } from '../../services/patientData'

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

function HxTabsForPatient({ patientId }) {
  const [value, setValue] = useState(0)
  const [isFemale, setIsFemale] = useState(false)
  const { scrollTop } = useContext(ScrollTopContext)
  const wrapperRef = useScrollToTopOnChange(value, scrollTop)

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
      setValue(6) // Scoliosis tab for males
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
          <Tab label='PHQ' {...a11yProps(isFemale ? 6 : 5)} />
          <Tab label='Scoliosis' {...a11yProps(isFemale ? 7 : 6)} />
          <Tab label='OSA' {...a11yProps(isFemale ? 8 : 7)} />
          <Tab label='M4/M5 Review' {...a11yProps(isFemale ? 9 : 8)} />
        </Tabs>
      </AppBar>
      <LazyTabPanel key='hcsr' value={value} index={0}>
        <HxHcsrForm changeTab={handleChange} nextTab={1} />
      </LazyTabPanel>
      <LazyTabPanel key='pmhx' value={value} index={1}>
        <HxNssForm changeTab={handleChange} nextTab={2} />
      </LazyTabPanel>
      <LazyTabPanel key='social' value={value} index={2}>
        <HxSocialForm changeTab={handleChange} nextTab={3} />
      </LazyTabPanel>
      <LazyTabPanel key='oral' value={value} index={3}>
        <HxOralForm changeTab={handleChange} nextTab={4} />
      </LazyTabPanel>
      <LazyTabPanel key='family' value={value} index={4}>
        <HxFamilyForm changeTab={handleChange} nextTab={5} />
      </LazyTabPanel>
      {/* Only show hxGynae form if the patient is female */}
      {isFemale && (
        <LazyTabPanel key='gynae' value={value} index={5}>
          <HxGynaeForm changeTab={handleChange} nextTab={6} />
        </LazyTabPanel>
      )}
      <LazyTabPanel key='phq' value={value} index={isFemale ? 6 : 5}>
        <HxPhqForm changeTab={handleChange} nextTab={isFemale ? 7 : 6} />
      </LazyTabPanel>
      <LazyTabPanel key='scoliosis' value={value} index={isFemale ? 7 : 6}>
        <HxScoliosisForm changeTab={handleChange} nextTab={isFemale ? 8 : 7} />
      </LazyTabPanel>
      <LazyTabPanel key='osa' value={value} index={isFemale ? 8 : 7}>
        <HxOsaForm changeTab={handleChange} nextTab={isFemale ? 9 : 8} />
      </LazyTabPanel>
      <LazyTabPanel key='review' value={value} index={isFemale ? 9 : 8}>
        <HxM4M5ReviewForm />
      </LazyTabPanel>
    </HxWrapper>
  )
}

export default function HxTabs() {
  const { patientId } = useContext(FormContext)

  return <HxTabsForPatient key={patientId} patientId={patientId} />
}
