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
  const handleLogin = async (values) => {
      try {
          const payload = {username: values.email, password: values.password, type: accountOption}
          const credentials = Realm.Credentials.function(payload);
          // Authenticate the user
          const user = await mongoDB.logIn(credentials);
          isLogin(true)
          const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas")
          if (accountOption === accountOptions[1]) {
              //admin
              const userProfile = mongoConnection.db("phs").collection("admin_profiles")
              const profile = await userProfile.findOne({username: values.email})
              setProfile(profile)
          } else {
              const userProfile = mongoConnection.db("phs").collection("guest_profiles")
              const profile = await userProfile.findOne({username: values.email})
              setProfile(profile)
          }
          navigate('/app/registration', { replace: true });

          return user
      } catch(err) {
          console.log(err)
          alert("Invalid Username or Password!")
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
                    Sign in now
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
