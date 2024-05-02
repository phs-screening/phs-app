import React, { useEffect, useState } from 'react'
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from '@material-ui/core'
import * as Yup from 'yup'
import { Formik } from 'formik'
import mongoDB, { hashPassword, isAdmin, profilesCollection } from '../services/mongoDB'
import { Visibility, VisibilityOff, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { regexPasswordPattern as pattern } from '../api/api'

const ManageVolunteers = () => {
  const navigate = useNavigate()
  const [loading, isLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = () => setShowPassword(!showPassword)
  const [guestUsers, setGuestUsers] = useState([])
  const [showPasswordReset, setShowPasswordReset] = useState(false)
  const handleClickShowPasswordReset = () => setShowPasswordReset(!showPasswordReset)
  const handleMouseDownPasswordReset = () => setShowPasswordReset(!showPasswordReset)
  const [resetPassword, setResetPassword] = useState('')
  const [loadingReset, isLoadingReset] = useState(false)
  const [nameReset, setNameReset] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [search, setSearch] = useState('')
  const [loadingDelete, isLoadingDelete] = useState(false)

  useEffect(async () => {
    if (await isAdmin()) {
      const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
      const guestProfiles = await mongoConnection
        .db('phs')
        .collection('profiles')
        .find({ is_admin: { $ne: true } })
      setGuestUsers(guestProfiles)
    } else {
      alert('Only Admins have access to this Page!')
      navigate('/app/registration', { replace: true })
    }
  }, [refresh])

  const handleCreateAccount = async (values) => {
    const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
    const guestProfiles = mongoConnection.db('phs').collection('profiles')
    isLoading(true)
    try {
      // ensure volunteer names are unique
      const searchUnique = await guestProfiles.findOne({ username: values.email })

      if (searchUnique === null) {
        if (!pattern.test(values.password)) {
          alert(
            'Password must contain at least one uppercase, one lowercase, one number and one special character and 12 characters long',
          )
          isLoading(false)
        } else {
          const hashHex = await hashPassword(values.password)

          await guestProfiles.insertOne({
            username: values.email,
            password: hashHex,
          })

          alert('Account Created: ' + values.email)
          setRefresh(!refresh)
          isLoading(false)
        }
      } else {
        alert('Username ' + values.email + ' taken! Try another username!')
        isLoading(false)
      }
    } catch (e) {
      alert('Contact Developer: ' + e)
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

  const listItemManageVolunteers = guestUsers
    .sort(sortUsers)
    .filter((x) =>
      x.username
        .toLowerCase()
        .trim()
        .substr(0, search.length)
        .includes(search.toLowerCase().trim()),
    )
    .map((guest, index) => {
      return (
        <li style={styles.manageVolunteersItem} key={index}>
          <div style={styles.manageVolunteersDetails}>
            <div>{guest.username}</div>
            <div>
              Last Login: {guest.lastLogin ? guest.lastLogin.toString() : 'Has not Logged In'}
            </div>
          </div>

          <div style={styles.manageVolunteersItemButtonLayout}>
            <Button
              color='primary'
              style={styles.manageVolunteersItemButton}
              size='small'
              type='submit'
              variant='contained'
              onClick={() => {
                setNameReset(guest.username)
              }}
            >
              Reset Password
            </Button>
            <Button
              color='primary'
              // disabled={isSubmitting}
              style={styles.manageVolunteersItemButton}
              size='small'
              type='submit'
              variant='contained'
              onClick={() => deleteAccount(guest.username)}
            >
              Delete Account
            </Button>
          </div>
        </li>
      )
    })

  const deleteAccount = async (username) => {
    isLoadingDelete(true)
    try {
      await profilesCollection()
        .deleteOne({
          username: username,
        })
        .then(() => {
          setRefresh(!refresh)
          isLoadingDelete(false)
          alert('Account Successfully deleted: ' + username)
        })
    } catch (e) {
      alert('Error Deleting Account!: ' + e)
      isLoadingDelete(false)
    }
  }

  const handleResetPassword = async () => {
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
    const hashHex = await hashPassword(resetPassword)
    try {
      await profilesCollection()
        .updateOne(
          {
            username: nameReset,
          },
          { $set: { password: hashHex } },
        )
        .then(() => {
          isLoadingReset(false)
          setResetPassword('')
          alert('password successfully reset for: ' + nameReset)
        })
    } catch (e) {
      alert('Error resetting password!, No user selected!: ' + e)
      isLoadingReset(false)
      setResetPassword('')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.create}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().max(255).required('Username is required'),
            password: Yup.string().max(255).required('Password is required'),
          })}
          onSubmit={(values, { resetForm }) => {
            handleCreateAccount(values).then(() => resetForm())
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography color='textPrimary' variant='h2'>
                  Create Volunteer Account
                </Typography>
              </Box>
              <TextField
                // error={Boolean(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                label='Username'
                margin='normal'
                name='email'
                onBlur={handleBlur}
                onChange={handleChange}
                type=''
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
                  form: {
                    autocomplete: 'off',
                  },
                }}
              />
              <Box sx={{ py: 2 }}>
                {loading ? (
                  <div>Creating Account..</div>
                ) : (
                  <Button
                    color='primary'
                    // disabled={isSubmitting}
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
      </div>

      <Box sx={{ pl: 7, mb: 3 }}>
        <Typography color='textPrimary' variant='h2'>
          Manage Volunteer Accounts ({guestUsers.length})
        </Typography>
      </Box>

      <Box sx={{ px: 7, mb: 3 }}>
        <div>Search Volunteer Accounts</div>
        <TextField
          fullWidth
          label='Search'
          margin='normal'
          name='search'
          value={search}
          variant='outlined'
          onChange={(x) => {
            setSearch(x.target.value)
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
        />
      </Box>

      <Box sx={{ px: 7, mb: 3 }}>
        <ul style={styles.manageVolunteers}>
          {loadingDelete ? <div> Deleting Account... </div> : listItemManageVolunteers}
        </ul>
      </Box>

      <Box sx={{ px: 7, mb: 3 }}>
        <div>
          Resetting Password for:{' '}
          <span style={styles.boldVolunteerName}>{nameReset === null ? 'None' : nameReset}</span>
        </div>
        <TextField
          // error={Boolean(touched.password && errors.password)}
          fullWidth
          label='Password'
          margin='normal'
          name='password'
          type={showPasswordReset ? 'text' : 'password'}
          value={resetPassword}
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
                >
                  {showPasswordReset ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
            autocomplete: 'new-password',
            form: {
              autocomplete: 'off',
            },
          }}
        />
        {loadingReset ? (
          <div> Resetting ... </div>
        ) : (
          <Button
            color='primary'
            // disabled={isSubmitting}
            size='large'
            type='submit'
            variant='contained'
            onClick={handleResetPassword}
          >
            CONFIRM
          </Button>
        )}
      </Box>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: "center",
    // alignItems:"center",
    width: '100%',
    height: '100%',
    // borderStyle: "solid",
  },
  create: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: "center",
    // alignItems:"center",
    width: '100%',
    // borderStyle: "solid",
    fontSize: 20,
    paddingLeft: 10,
  },
  createInput: {
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: "center",
    // alignItems:"center",
    width: '50%',
    // borderStyle: "solid",
    fontSize: 20,
    paddingLeft: 10,
  },
  manageVolunteers: {
    // paddingLeft: 30,
    height: 300,
    width: '100%',
    overflow: 'hidden',
    overflowY: 'scroll',
  },
  manageVolunteersItem: {
    // paddingLeft: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems:"center",
    // height: 50,
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 2,
    marginBottom: 10,
    borderRadius: 5,
  },
  manageVolunteersItemButton: {
    // background: "#6865bf",
    marginLeft: 10,
    marginRight: 10,
    width: '100%',
  },
  manageVolunteersDetails: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingBottom: 5,
  },
  manageVolunteersItemButtonLayout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  boldVolunteerName: {
    fontWeight: 'bold',
    fontSize: 20,
  },
}

export default ManageVolunteers
