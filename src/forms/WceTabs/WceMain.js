import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/system'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ScrollTopContext } from '../../api/utils.js'
import WceForm from './WceForm.js'
import GynaeForm from './GynaeForm.js'

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

const WceWrapper = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
  background-color: ${theme.palette.background.paper};
`,
)

export default function WceTabs() {
  const [value, setValue] = React.useState(0)
  const { scrollTop } = React.useContext(ScrollTopContext)

  const handleChange = (event, newValue) => {
    scrollTop()
    setValue(newValue)
  }

  return (
    <WceWrapper>
      <AppBar position='static' color='default'>
        <Tabs value={value} onChange={handleChange} aria-label='simple tabs example'>
          <Tab label='WCE' {...a11yProps(0)} />
          <Tab label='Gynae' {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <WceForm changeTab={handleChange} nextTab={1} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GynaeForm changeTab={handleChange} nextTab={2} />
      </TabPanel>
    </WceWrapper>
  )
}
