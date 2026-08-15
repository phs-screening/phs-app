import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import { FormContext, ScrollTopContext } from '../../api/utils.js'
import useScrollToTopOnChange from '../../hooks/useScrollToTopOnChange.js'
import { getSavedData } from '../../services/patientData'
import allForms from '../forms.json'
import GeriPhysicalActivityLevelForm from './GeriPhysicalActivityLevelForm.jsx'
import GeriOtQuestionnaireForm from './GeriOtQuestionnaireForm.jsx'
import GeriSppbForm from './GeriSppbForm.jsx'
import GeriPtConsultForm from './GeriPtConsultForm.jsx'
import GeriOtConsultForm from './GeriOtConsultForm.jsx'

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
  background-color: ${theme.palette.background.paper};
`,
)

export default function GeriMobilityTabs() {
  const [activeTab, setActiveTab] = React.useState('physical')
  const [physicalPtReferral, setPhysicalPtReferral] = React.useState(false)
  const [sppbPtReferral, setSppbPtReferral] = React.useState(false)
  const [homefastOtReferral, setHomefastOtReferral] = React.useState(false)
  const { patientId } = React.useContext(FormContext)
  const { scrollTop } = React.useContext(ScrollTopContext)
  const navigate = useNavigate()

  const showPtConsult = physicalPtReferral || sppbPtReferral
  const showOtConsult = homefastOtReferral
  const availableTabs = React.useMemo(
    () => [
      { key: 'physical', label: 'Physical Activity Level' },
      { key: 'homefast', label: 'Homefast' },
      { key: 'sppb', label: 'SPPB' },
      ...(showPtConsult ? [{ key: 'pt', label: 'PT Consult' }] : []),
      ...(showOtConsult ? [{ key: 'ot', label: 'OT Consult' }] : []),
    ],
    [showPtConsult, showOtConsult],
  )
  const value = Math.max(
    availableTabs.findIndex(({ key }) => key === activeTab),
    0,
  )
  const wrapperRef = useScrollToTopOnChange(value, scrollTop)

  React.useEffect(() => {
    let isCurrent = true
    setPhysicalPtReferral(false)
    setSppbPtReferral(false)
    setHomefastOtReferral(false)
    setActiveTab('physical')

    const loadReferrals = async () => {
      try {
        const [physical, homefast, sppb] = await Promise.all([
          getSavedData(patientId, allForms.geriPhysicalActivityLevelForm),
          getSavedData(patientId, allForms.geriOtQuestionnaireForm),
          getSavedData(patientId, allForms.geriSppbForm),
        ])
        if (!isCurrent) return

        setPhysicalPtReferral(physical?.geriPhysicalActivityLevelQ11 === 'Yes')
        setHomefastOtReferral(homefast?.geriOtQuestionnaireQ34 === 'Yes')
        setSppbPtReferral(sppb?.geriSppbQ11 === 'Yes')
      } catch (error) {
        console.error('Failed to load Geriatrics Mobility referrals:', error)
      }
    }

    loadReferrals()
    return () => {
      isCurrent = false
    }
  }, [patientId])

  React.useEffect(() => {
    if (!availableTabs.some(({ key }) => key === activeTab)) {
      setActiveTab('physical')
    }
  }, [activeTab, availableTabs])

  const handleChange = (event, newValue) => {
    scrollTop()
    const nextTab = availableTabs[newValue]
    if (nextTab) {
      setActiveTab(nextTab.key)
    }
  }

  const handleSppbSubmitted = (values) => {
    const referredBySppb = values.geriSppbQ11 === 'Yes'
    setSppbPtReferral(referredBySppb)

    if (physicalPtReferral || referredBySppb) {
      setActiveTab('pt')
    } else if (homefastOtReferral) {
      setActiveTab('ot')
    } else {
      navigate('/app/dashboard')
    }
  }

  const handlePtConsultSubmitted = () => {
    if (homefastOtReferral) {
      setActiveTab('ot')
    } else {
      navigate('/app/dashboard')
    }
  }

  return (
    <GeriMobilityWrapper ref={wrapperRef}>
      <AppBar position='static' color='default'>
        <Tabs value={value} onChange={handleChange} aria-label='GeriMobility tabs'>
          {availableTabs.map(({ key, label }, index) => (
            <Tab key={key} label={label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <GeriPhysicalActivityLevelForm
          changeTab={handleChange}
          nextTab={1}
          onReferralSubmitted={(answer) => setPhysicalPtReferral(answer === 'Yes')}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GeriOtQuestionnaireForm
          changeTab={handleChange}
          nextTab={2}
          onReferralSubmitted={(answer) => setHomefastOtReferral(answer === 'Yes')}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <GeriSppbForm changeTab={handleChange} nextTab={3} onSubmitted={handleSppbSubmitted} />
      </TabPanel>
      {showPtConsult && (
        <TabPanel value={value} index={availableTabs.findIndex(({ key }) => key === 'pt')}>
          <GeriPtConsultForm onSubmitted={handlePtConsultSubmitted} />
        </TabPanel>
      )}
      {showOtConsult && (
        <TabPanel value={value} index={availableTabs.findIndex(({ key }) => key === 'ot')}>
          <GeriOtConsultForm />
        </TabPanel>
      )}
    </GeriMobilityWrapper>
  )
}
