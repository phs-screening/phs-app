import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { isAdmin } from '../services/authSession'
import { getProfiles } from '../api/profilesApi'
import { Visibility, VisibilityOff, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { regexPasswordPattern as pattern } from '../api/formHelpers.jsx'
import {
  deleteAccount as deleteAccountRequest,
  resetPassword as resetPasswordRequest,
  signup,
} from '../api/authApi'

const ManageVolunteers = () => {
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)
  const [guestUsers, setGuestUsers] = useState([])
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const handleClickShowPasswordReset = () => setShowPasswordReset(!showPasswordReset)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const handleMouseDownPasswordReset = () => setShowPasswordReset(!showPasswordReset)
  const [resetPassword, setResetPassword] = useState('')
  const [loadingReset, isLoadingReset] = useState(false)
  const [nameReset, setNameReset] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [search, setSearch] = useState('')
  const [loadingDelete, isLoadingDelete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchData = async () => {
      if (await isAdmin()) {
        const profilesResponse = await getProfiles()
        const profiles = profilesResponse.data || []
        const guestProfiles = await profiles.filter((p) => !p.is_admin)
        setGuestUsers(guestProfiles)
      } else {
        alert('Only Admins have access to this Page!')
        navigate('/app/registration', { replace: true })
      }
    }
    fetchData()
  }, [refresh, navigate])

  const handleCreateAccount = async (values) => {
    isLoading(true)
    try {
      const data = await signup(values.email, values.password)
      if (!data.result) {
        alert('Error Creating Account: ' + data.error)
      } else {
        alert('Account Created: ' + values.email)
        setRefresh(!refresh)
      }
    } catch (e) {
      alert('Contact Developer: ' + e)
    } finally {
      isLoading(false)
    }
  }

  const sortUsers = (a, b) => {
    if (a.username < b.username) {
      return -1
    } else {
      return 1
    }
  }

  const filteredUsers = guestUsers
    .sort(sortUsers)
    .filter((x) =>
      x.username
        .toLowerCase()
        .trim()
        .substr(0, search.length)
        .includes(search.toLowerCase().trim()),
    )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const listItemManageVolunteers = paginatedUsers.map((guest, index) => {
    return (
      <li style={styles.manageVolunteersItem} key={index}>
        <div style={styles.manageVolunteersDetails}>
          <Typography variant='body1' sx={{ fontWeight: '600', fontSize: '16px' }}>
            {guest.username}
          </Typography>
          <Typography variant='caption' sx={{ color: '#666', mt: 0.5 }}>
            Last Login: {guest.last_login ? new Date(guest.last_login).toLocaleString() : 'Never'}
          </Typography>
        </div>

        <div style={styles.manageVolunteersItemButtonLayout}>
          <Button
            color='primary'
            size='small'
            variant='contained'
            onClick={() => {
              setShowResetDialog(true)
              setNameReset(guest.username)
            }}
            sx={{ textTransform: 'none' }}
          >
            Reset Password
          </Button>
          <Button
            color='error'
            size='small'
            variant='outlined'
            onClick={() => deleteAccount(guest.username)}
            sx={{ textTransform: 'none' }}
          >
            Delete
          </Button>
        </div>
      </li>
    )
  })

  const deleteAccount = async (username) => {
    isLoadingDelete(true)
    try {
      const data = await deleteAccountRequest(username)
      if (!data.result) {
        alert('Error Deleting Account: ' + data.error)
      } else {
        setRefresh(!refresh)
        alert('Account Successfully deleted: ' + username)
      }
    } catch (e) {
      alert('Error Deleting Account!: ' + e)
    } finally {
      isLoadingDelete(false)
    }
  }

  const handleResetPassword = async () => {
    if (!nameReset) {
      alert('Select a name first!')
      return
    }
    if (resetPassword.length === 0) {
      alert('Password Cannot be Empty!')
      return
    }

    if (!pattern.test(resetPassword)) {
      alert(
        'Password must contain at least one uppercase, one lowercase, one number and one special character and 12 characters long',
      )
      return
    }
    isLoadingReset(true)
    try {
      const data = await resetPasswordRequest(nameReset, resetPassword)
      if (!data.result) {
        alert('Error resetting password!: ' + data.error)
      } else {
        setShowResetDialog(false)
        setNameReset(null)
        alert('Password successfully reset for: ' + nameReset)
      }
    } catch (e) {
      alert('Error resetting password!: ' + e)
      isLoadingReset(false)
      setResetPassword('')
    }
  }

  const handleCloseResetDialog = () => {
    setShowResetDialog(false)
    setResetPassword('')
    setNameReset(null)
  }

  return (
    <div style={styles.page}>
      {/* Create Account Section */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          py: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1000, px: 3 }}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Enter a valid email address, e.g. volunteer@example.com')
                .max(255)
                .required('Email is required'),
              password: Yup.string().max(255).required('Password is required'),
            })}
            onSubmit={(values, { resetForm }) => {
              handleCreateAccount(values).then(() => resetForm())
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography color='textPrimary' variant='h4' sx={{ fontWeight: 'bold' }}>
                    Create Volunteer Account
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={
                    touched.email && errors.email
                      ? errors.email
                      : 'Use the volunteer email address they will use to log in.'
                  }
                  label='Email'
                  margin='normal'
                  name='email'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder='e.g. volunteer@example.com'
                  type='email'
                  value={values.email}
                  variant='outlined'
                  inputProps={{
                    autocomplete: 'new-password',
                    form: {
                      autocomplete: 'off',
                    },
                  }}
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
                    form: {
                      autocomplete: 'off',
                    },
                  }}
                />
                <Box sx={{ py: 3 }}>
                  {loading ? (
                    <Typography sx={{ textAlign: 'center', color: 'gray' }}>
                      Creating Account..
                    </Typography>
                  ) : (
                    <Button
                      color='primary'
                      fullWidth
                      size='large'
                      type='submit'
                      variant='contained'
                    >
                      Create Account
                    </Button>
                  )}
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>

      {/* Manage Accounts Section */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 1000, px: 3 }}>
          <Typography color='textPrimary' variant='h4' sx={{ fontWeight: 'bold', mb: 3 }}>
            Manage Volunteer Accounts ({filteredUsers.length})
          </Typography>

          <TextField
            fullWidth
            label='Search Volunteers'
            margin='normal'
            name='search'
            value={search}
            placeholder='Enter username to search...'
            variant='outlined'
            onChange={(x) => {
              setSearch(x.target.value)
              setCurrentPage(1)
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Search />
                </InputAdornment>
              ),
              form: {
                autocomplete: 'off',
              },
            }}
            sx={{ mb: 3 }}
          />

          <ul style={styles.manageVolunteers}>
            {loadingDelete ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Deleting Account...
              </div>
            ) : listItemManageVolunteers.length > 0 ? (
              listItemManageVolunteers
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                No volunteers found
              </div>
            )}
          </ul>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color='primary'
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Reset Password Dialog Modal */}
      <Dialog open={showResetDialog} onClose={handleCloseResetDialog} maxWidth='sm' fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1 }}>Reset Password for {nameReset}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label='New Password'
              name='password'
              type={showPasswordReset ? 'text' : 'password'}
              value={resetPassword}
              placeholder='Enter new password'
              variant='outlined'
              onChange={(x) => {
                setResetPassword(x.target.value)
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowPasswordReset}
                      onMouseDown={handleMouseDownPasswordReset}
                      size='small'
                    >
                      {showPasswordReset ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant='caption' sx={{ color: '#666', mt: 1, display: 'block' }}>
              Password must contain at least one uppercase, one lowercase, one number, one special
              character, and be 12+ characters long.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseResetDialog} variant='outlined'>
            Cancel
          </Button>
          <Button
            onClick={handleResetPassword}
            variant='contained'
            color='primary'
            disabled={loadingReset}
          >
            {loadingReset ? 'Resetting...' : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minHeight: '100vh',
    bgcolor: '#fafafa',
  },
  manageVolunteers: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    height: 400,
    width: '100%',
    overflow: 'hidden',
    overflowY: 'scroll',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  },
  manageVolunteersItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    borderBottom: '1px solid #e0e0e0',
    padding: '16px',
    boxSizing: 'border-box',
  },
  manageVolunteersDetails: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '12px',
  },
  manageVolunteersItemButtonLayout: {
    display: 'flex',
    gap: '8px',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  manageVolunteersItemButton: {
    flex: 1,
  },
}

export default ManageVolunteers
