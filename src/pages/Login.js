import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import mongoDB from "../services/mongoDB";
import * as Realm from "realm-web";
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@material-ui/core';
import {useContext, useState} from "react";
import {LoginContext} from '../App.js'

// TODO
// Explore using hash function to store passwords on DB

const Login = () => {
  const navigate = useNavigate();
  const [accountOptions, setAccountOptions] = useState(["Guest", "Admin"]);
  const [accountOption, setAccountOption] = useState("Guest");
  const {isLogin} = useContext(LoginContext);
  const {setProfile} = useContext(LoginContext);
  const [loading, isLoading] = useState(false);
  const handleLogin = async (values) => {
      try {
          // fix uid?
         isLoading(true)
          if (accountOption === accountOptions[1]) {
              //admin
              const credentials = Realm.Credentials.emailPassword(values.email, values.password)
              // Authenticate the user
              const user = await mongoDB.logIn(credentials);
              const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas")
              const userProfile = mongoConnection.db("phs").collection("profiles")
              const profile = await userProfile.findOne({username: values.email})
              console.log(profile)
              console.log(user.profile.email)
              console.log(user.profile.name)
              setProfile(profile)
              isLogin(true)
          } else {
              const credentials = Realm.Credentials.function({username: values.email, password: values.password})
              // Authenticate the user
              const user = await mongoDB.logIn(credentials);
              const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas")
              const userProfile = mongoConnection.db("phs").collection("profiles")
              const profile = await userProfile.findOne({username: values.email})
              isLogin(true)
              setProfile(profile)
          }
          isLoading(false)
          navigate('/app/registration', { replace: true });

      } catch(err) {
          console.log(err)
          isLoading(false)
          alert("Invalid Username or Password!")
      }
      isLoading(false)
  }
  const handleReset = async (values) => {
      const email = values.email
      try {
          await mongoDB.emailPasswordAuth.sendResetPasswordEmail(email)
          alert("Email sent to your account!")
      } catch (e) {
          alert("Invalid Email!")
      }
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().max(255).required('Username is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values) => {
                handleLogin(values)
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Sign in
                  </Typography>

                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    PHS 2021
                  </Typography>

                    <select
                    onChange={(e => {
                        setAccountOption(e.target.value)
                    })}>
                        {accountOptions.map(account => (
                            <option name={"account"} value={account} key={account}>
                                {account}
                            </option>
                        ))}
                    </select>

                </Box>
                <TextField
                  // error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Username"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type=""
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  // error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    // disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                      {loading ? "Logging in...":"Sign in now"}
                  </Button>
                </Box>
                  {accountOption === accountOptions[1] && <Box sx={{ py: 1 }}>
                      <Button
                          color="primary"
                          // disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="button"
                          variant="contained"
                          onClick={() => {
                              handleReset(values)}
                          }
                      >
                          Reset Password
                      </Button>
                  </Box>}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
