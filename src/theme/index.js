import { createTheme } from '@mui/system'
import shadows from './shadows'
import typography from './typography'

const theme = createTheme({
  palette: {
    background: {
      default: '#F4F6F8',
      paper: '#ffffff',
    },
    primary: {
      contrastText: '#ffffff',
      main: '#0A437F',
    },
    secondary: {
      main: '#0A437F',
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
    },
  },
  shadows,
  typography,
})

export default theme
