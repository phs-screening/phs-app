import React from 'react'
import { styled } from '@mui/system'
import { AppBar, Tabs, Tab, Paper } from '@mui/material'

import { FormContext, ScrollTopContext } from '../../api/utils.js'
import LazyTabPanel from '../../components/form-components/LazyTabPanel.jsx'
import useScrollToTopOnChange from '../../hooks/useScrollToTopOnChange.js'
import WceForm from './WceForm.jsx'
import GynaeForm from './GynaeForm.jsx'

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const WceWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.paper,
}))

function WceTabsForPatient() {
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
        <Tabs value={value} onChange={handleChange} aria-label='WCE tabs'>
          <Tab label='WCE' {...a11yProps(0)} />
          <Tab label='Gynae' {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <Paper elevation={2}>
        <LazyTabPanel value={value} index={0}>
          <WceForm changeTab={handleChange} nextTab={1} />
        </LazyTabPanel>
        <LazyTabPanel value={value} index={1}>
          <GynaeForm changeTab={handleChange} nextTab={2} />
        </LazyTabPanel>
      </Paper>
    </WceWrapper>
  )
}

export default function WceTabs() {
  const { patientId } = React.useContext(FormContext)

  return <WceTabsForPatient key={patientId} />
}
