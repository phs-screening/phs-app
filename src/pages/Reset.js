import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import mongoDB from '../services/mongoDB'
import * as Realm from 'realm-web'
import * as Yup from 'yup'
import { Formik } from 'formik'
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core'
import { useContext, useState } from 'react'
import { LoginContext } from '../App.js'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { regexPasswordPattern as pattern } from '../api/api'

// TODO
// Explore using hash function to store passwords on DB

const Reset = () => {
  const navigate = useNavigate()
  let location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)

  const handleReset = async (values) => {
    const urlParamToken = new URLSearchParams(location.search).get('token')
    const urlParamTokenID = new URLSearchParams(location.search).get('tokenId')
    const newPassword = values.password
    // regex check

    if (!pattern.test(values.password)) {
      alert(
        'Password must contain at least one uppercase, one lowercase, one number and one special character and 12 characters long',
      )
    } else {
      try {
        await mongoDB.emailPasswordAuth.resetPassword(urlParamToken, urlParamTokenID, newPassword)
        alert('Password Reset')
        navigate('/login', { replace: true })
      } catch (e) {
        alert('Invalid Link! Contact Dev')
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Reset</title>
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
              password: '',
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={(values) => {
              handleReset(values)
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color='textPrimary' variant='h2'>
                    Reset Password
                  </Typography>

                  <Typography color='textSecondary' gutterBottom variant='body2'>
                    PHS
                  </Typography>
                </Box>
                <TextField
                  // error={Boolean(touched.password && errors.password)}
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
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color='primary'
                    // disabled={isSubmitting}
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                  >
                    Reset Password
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  )
}

export default Reset
