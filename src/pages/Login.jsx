import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Link from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { useContext, useState } from 'react'
import { LoginContext } from '../App.jsx'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { login, signup } from '../api/authApi'

const Login = () => {
  const navigate = useNavigate()
  const [accountOptions /*setAccountOptions*/] = useState(['Guest', 'Admin'])
  const [accountOption, setAccountOption] = useState('Guest')
  const { isLogin } = useContext(LoginContext)
  const { setProfile } = useContext(LoginContext)
  const [loading, isLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authMessage, setAuthMessage] = useState(null)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  // sign up API version
  const handleSignUp = async (values) => {
    isLoading(true)
    setAuthMessage(null)
    try {
      const data = await signup(values.email, values.password)

      if (data.result) {
        setAuthMessage({
          severity: 'success',
          text: `Account created: ${values.email}. You can now sign in.`,
        })
        setTimeout(() => setIsSignUp(false), 1)
      } else {
        setAuthMessage({
          severity: 'error',
          text: data.error || 'Unable to create account.',
        })
      }
    } catch (e) {
      setAuthMessage({
        severity: 'error',
        text: `Unable to create account: ${e.message}`,
      })
    } finally {
      isLoading(false)
    }
  }

  // login API version
  const handleLogin = async (values) => {
    isLoading(true)
    setAuthMessage(null)
    try {
      let type = 'Guest'
      if (accountOption === accountOptions[1]) {
        type = 'Admin'
      }

      const data = await login(values.email, values.password, type)

      if (data.result) {
        if (data.token) {
          localStorage.setItem('authToken', data.token)
        }
        localStorage.setItem('profile', JSON.stringify(data.user))
        setProfile(data.user)
        isLogin(true)
        navigate('/app/registration', { replace: true })
      } else {
        setAuthMessage({
          severity: 'error',
          text: data.error || 'Invalid username or password.',
        })
      }
    } catch (e) {
      setAuthMessage({
        severity: 'error',
        text: `Login failed: ${e.message || 'Invalid username or password.'}`,
      })
    } finally {
      isLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{isSignUp ? 'Sign up' : 'Login'}</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth='sm'>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required('Username is required, you can use your email'),
              password: Yup.string()
                .max(255)
                .required('Password is required'),
              ...(isSignUp && {
                confirmPassword: Yup.string()
                  .oneOf([Yup.ref('password'), null], 'Passwords must match')
                  .required('Confirm Password is required'),
              }),
            })}
            onSubmit={(values) => {
              if (isSignUp) {
                handleSignUp(values)
              } else {
                handleLogin(values)
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color='textPrimary' variant='h2'>
                    {isSignUp ? 'Sign up' : 'Sign in'}
                  </Typography>
                  <Typography color='textSecondary' gutterBottom variant='body2'>
                    PHS {new Date().getFullYear()}
                  </Typography>
                  {!isSignUp && (
                    <select
                      onChange={(e) => {
                        setAccountOption(e.target.value)
                        setAuthMessage(null)
                      }}
                    >
                      {accountOptions.map((account) => (
                        <option name={'account'} value={account} key={account}>
                          {account}
                        </option>
                      ))}
                    </select>
                  )}
                </Box>
                {authMessage && (
                  <Alert severity={authMessage.severity} sx={{ mb: 2 }}>
                    {authMessage.text}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  helperText={touched.email && errors.email}
                  label='Username'
                  margin='normal'
                  name='email'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  variant='outlined'
                />
                <TextField
                  fullWidth
                  helperText={touched.password && errors.password}
                  label='Password'
                  margin='normal'
                  name='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  variant='outlined'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          size='large'
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {isSignUp && (
                  <TextField
                    fullWidth
                    helperText={touched.confirmPassword && errors.confirmPassword}
                    label='Confirm Password'
                    margin='normal'
                    name='confirmPassword'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type='password'
                    value={values.confirmPassword}
                    variant='outlined'
                  />
                )}

                <Box sx={{ py: 2 }}>
                  <Button
                    color='primary'
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                    disabled={loading}
                    sx={{
                      ...(loading && {
                        backgroundColor: '#bdbdbd',
                        color: '#fff',
                      }),
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={24} color='inherit' sx={{ mr: 1 }} />
                        {isSignUp ? 'Signing up...' : 'Logging in...'}
                      </>
                    ) : isSignUp ? (
                      'Sign up'
                    ) : (
                      'Sign in now'
                    )}
                  </Button>
                </Box>

                {/* Toggle between Sign In and Sign Up */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  {!isSignUp ? (
                    <Link
                      component='button'
                      variant='body2'
                      onClick={() => {
                        setIsSignUp(true)
                        setAuthMessage(null)
                      }}
                    >
                      Don&apos;t have an account? Sign up here.
                    </Link>
                  ) : (
                    <Link
                      component='button'
                      variant='body2'
                      onClick={() => {
                        setIsSignUp(false)
                        setAuthMessage(null)
                      }}
                    >
                      Already have an account? Sign in here.
                    </Link>
                  )}
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  )
}

export default Login
