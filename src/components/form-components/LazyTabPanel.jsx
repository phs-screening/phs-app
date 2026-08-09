import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

export default function LazyTabPanel({ children, value, index, idPrefix = 'simple', ...other }) {
  const active = value === index
  const [hasBeenActive, setHasBeenActive] = useState(active)

  useEffect(() => {
    if (active) {
      setHasBeenActive(true)
    }
  }, [active])

  return (
    <div
      role='tabpanel'
      hidden={!active}
      id={`${idPrefix}-tabpanel-${index}`}
      aria-labelledby={`${idPrefix}-tab-${index}`}
      {...other}
    >
      {(active || hasBeenActive) && (
        <Box sx={{ p: 3 }}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

LazyTabPanel.propTypes = {
  children: PropTypes.node,
  idPrefix: PropTypes.string,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}
