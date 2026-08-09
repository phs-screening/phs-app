import React from 'react'
import { styled } from '@mui/system'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { FormContext, ScrollTopContext } from '../../api/utils.js'
import LazyTabPanel from '../../components/form-components/LazyTabPanel.jsx'
import useScrollToTopOnChange from '../../hooks/useScrollToTopOnChange.js'
import GeriAmtForm from './GeriAmtForm.jsx'
import GeriPhqForm from './GeriPhqForm.jsx'
import GeriGraceForm from './GeriGraceForm.jsx'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const GeriCognitiveWrapper = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
  background-color: ${theme.palette.background.paper};
`,
)

function GeriCognitiveTabsForPatient() {
  const [value, setValue] = React.useState(0)
  const { scrollTop } = React.useContext(ScrollTopContext)
  const wrapperRef = useScrollToTopOnChange(value, scrollTop)

  const handleChange = (event, newValue) => {
    scrollTop()
    setValue(newValue)
  }

  return (
    <GeriCognitiveWrapper ref={wrapperRef}>
      <AppBar position='static' color='default'>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='geriatric cognitive assessment tabs'
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='PHQ' {...a11yProps(0)} />
          <Tab label='AMT' {...a11yProps(1)} />
          <Tab label='G-RACE' {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <LazyTabPanel value={value} index={0}>
        <GeriPhqForm changeTab={handleChange} nextTab={1} />
      </LazyTabPanel>

      <LazyTabPanel value={value} index={1}>
        <GeriAmtForm changeTab={handleChange} nextTab={2} />
      </LazyTabPanel>

      <LazyTabPanel value={value} index={2}>
        <GeriGraceForm changeTab={handleChange} nextTab={3} />
      </LazyTabPanel>
    </GeriCognitiveWrapper>
  )
}

export default function GeriCognitiveTabs() {
  const { patientId } = React.useContext(FormContext)

  return <GeriCognitiveTabsForPatient key={patientId} />
}
