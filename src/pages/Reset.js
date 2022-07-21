import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import mongoDB from "../services/mongoDB";
import * as Realm from "realm-web";
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
    Box,
    Button,
    Container, IconButton, InputAdornment,
    TextField,
    Typography
} from '@material-ui/core';
import {useContext, useState} from "react";
import {LoginContext} from '../App.js'
import {Visibility, VisibilityOff} from "@material-ui/icons";

// TODO
// Explore using hash function to store passwords on DB

const Reset = () => {
    const navigate = useNavigate();
    let location = useLocation()
    const [accountOptions, setAccountOptions] = useState(["Guest", "Admin"]);
    const [accountOption, setAccountOption] = useState("Guest");
    const {isLogin} = useContext(LoginContext);
    const {setProfile} = useContext(LoginContext);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleLogin = async (values) => {
        try {
            // fix uid?

            if (accountOption === accountOptions[1]) {
                //admin
                const credentials = Realm.Credentials.emailPassword(values.email, values.password)
                // Authenticate the user
                const user = await mongoDB.logIn(credentials);
                const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas")
                const userProfile = mongoConnection.db("phs").collection("profiles")
                const profile = await userProfile.findOne({username: values.email})
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
            navigate('/app/registration', { replace: true });

        } catch(err) {
            alert("Invalid Username or Password!")
        }
    }
    const handleReset = async (values) => {
        const urlParamToken = new URLSearchParams(location.search).get("token")
        const urlParamTokenID = new URLSearchParams(location.search).get("tokenId")
        const newPassword = values.password
        try {
            await mongoDB.emailPasswordAuth.resetPassword(urlParamToken, urlParamTokenID, newPassword)
            alert("Password Reset")
        } catch (e) {
            alert("Invalid Link! Contact Dev")
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
                    justifyContent: 'center'
                }}
            >
                <Container maxWidth="sm">
                    <Formik
                        initialValues={{
                            password: ''
                        }}
                        validationSchema={Yup.object().shape({
                            password: Yup.string().max(255).required('Password is required')
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
                              values
                          }) => (
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        color="textPrimary"
                                        variant="h2"
                                    >
                                        Reset Password
                                    </Typography>

                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                        variant="body2"
                                    >
                                        PHS
                                    </Typography>

                                </Box>
                                <TextField
                                    // error={Boolean(touched.password && errors.password)}
                                    fullWidth
                                    helperText={touched.password && errors.password}
                                    label="Password"
                                    margin="normal"
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    type={showPassword ? "text" : "password"}
                                    value={values.password}
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
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
                                        Reset Password
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

export default Reset;
