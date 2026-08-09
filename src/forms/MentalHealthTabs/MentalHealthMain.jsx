import React from 'react'
import { styled } from '@mui/system'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { FormContext, ScrollTopContext } from '../../api/utils.js'
import LazyTabPanel from '../../components/form-components/LazyTabPanel.jsx'
import useScrollToTopOnChange from '../../hooks/useScrollToTopOnChange.js'
import PhqForm from './MentalHealthPHQ.jsx'
import MentalHealthForm from './MentalHealthForm.jsx'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const WceWrapper = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
  background-color: ${theme.palette.background.paper};
`,
)

function MentalHealthTabsForPatient() {
  const [value, setValue] = React.useState(0)
  const { scrollTop } = React.useContext(ScrollTopContext)
  const wrapperRef = useScrollToTopOnChange(value, scrollTop)

  const handleChange = (event, newValue) => {
    scrollTop()
    setValue(newValue)
  }

  return (
    <WceWrapper ref={wrapperRef}>
      <AppBar position='static' color='default'>
        <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
          <Tab label='PHQ' {...a11yProps(0)} />
          <Tab label='Mental Health' {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <LazyTabPanel value={value} index={0}>
        <PhqForm changeTab={handleChange} nextTab={1} />
      </LazyTabPanel>
      <LazyTabPanel value={value} index={1}>
        <MentalHealthForm changeTab={handleChange} nextTab={2} />
      </LazyTabPanel>
    </WceWrapper>
  )
}

export default function MentalHealthTabs() {
  const { patientId } = React.useContext(FormContext)

  return <MentalHealthTabsForPatient key={patientId} />
}
