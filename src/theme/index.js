import { createTheme } from '@mui/system'
import shadows from './shadows'
import typography from './typography'

const customTheme = createTheme({
  components: {
    '*': {
      boxSizing: 'border-box',
      margin: 0,
      padding: 0,
    },
    html: {
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontsmoothing: 'grayscale',
      height: '100%',
      width: '100%',
    },
    body: {
      backgroundColor: '#f4f6f8',
      height: '100%',
      width: '100%',
    },
    a: {
      textDecoration: 'none',
    },
    form: {
      padding: '50px',
    },
    '#root': {
      height: '100%',
      width: '100%',
    },
  },

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
    grey: {
      main: '#808080',
    },
  },
  shadows,
  typography,
})

export default customTheme
