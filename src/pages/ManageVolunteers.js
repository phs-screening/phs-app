import React, {useEffect, useState} from "react";
import {
    Box, Typography, TextField, Button, InputAdornment, IconButton
} from '@material-ui/core';
import * as Yup from "yup";
import {Formik} from "formik";
import mongoDB, {hashPassword, isAdmin, profilesCollection} from "../services/mongoDB";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import {useNavigate} from "react-router-dom";

//Create multiple accounts at once
const ManageVolunteers = () => {
    const navigate = useNavigate();
    const [loading, isLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const [guestUsers, setGuestUsers] = useState([]);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const handleClickShowPasswordReset = () => setShowPasswordReset(!showPasswordReset);
    const handleMouseDownPasswordReset = () => setShowPasswordReset(!showPasswordReset);
    const [resetPassword, setResetPassword] = useState([]);
    const [indexReset, setIndexReset] = useState(-1);

    useEffect(async () => {
        if (await isAdmin()) {
            const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas")
            const guestProfiles = await mongoConnection.db("phs").collection("profiles")
                .find({is_admin: {$ne : true}})
            setGuestUsers(guestProfiles)
        } else {
            alert("Only Admins have access to this Page!")
            navigate('/app/registration', { replace: true });
        }

    }, [])

    const handleCreateAccount = async (values) => {
        const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas")
        const guestProfiles = mongoConnection.db("phs").collection("profiles")
        isLoading(true)
        try {
            const searchUnique = await guestProfiles.findOne({username:values.email})

            if (searchUnique === null) {
                const hashHex = await hashPassword(values.password)

                await guestProfiles.insertOne({
                    username: values.email,
                    password: hashHex,
                })

                alert("Account Created!")
                isLoading(false)
            } else {
                alert("Username taken! Try another username")
                isLoading(false)
            }
        } catch (e) {
            alert("Contact Developer: " + e)
            isLoading(false)
        }
    }
    const listItem = guestUsers.sort().map((guest, index) => {
        const resetPass = ""
        return <li style={styles.manageVolunteersItem}>
            <div style={styles.manageVolunteersDetails}>
                <div >
                    {guest.username}
                </div>
                <div>
                    Last Login: {guest.lastLogin ?  guest.lastLogin.toDateString() : "Has not Logged In"}
                </div>
            </div>

            <Button
                color="primary"
                // disabled={isSubmitting}
                size="small"
                type="submit"
                variant="contained"
                onClick={() => setIndexReset(index)}
            >
                Reset Password
            </Button>
        </li>
    })

    const handleResetPassword = async () => {
        const hashHex = await hashPassword(resetPassword)
        try {
            await profilesCollection().updateOne({
                username: guestUsers[indexReset].username,

            },{$set: {password: hashHex}}).then(() => alert("password successfully reset!"))
        } catch (e) {
            alert("Error resetting password!, No user selected!")
        }

    }

    return (
        <div style={styles.page}>
            <div style={styles.create}>
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
                        handleCreateAccount(values)
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
                                    Create Volunteer Account
                                </Typography>

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
                                {loading ? <div>Creating Account..</div> :<Button
                                    color="primary"
                                    // disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Create Account
                                </Button>}
                            </Box>
                        </form>
                    )}
                </Formik>

            </div>

            <Box sx={{ pl: 7, mb: 3 }}>
                <Typography
                    color="textPrimary"
                    variant="h2"
                >
                    Manage Guest Accounts
                </Typography>

            </Box>

            <Box sx={{ px: 7, mb: 3 }}>
                <ul style={styles.manageVolunteers}>
                    {listItem}
                </ul>
            </Box>

            <Box sx={{ px: 7, mb: 3 }}>
                <div>
                    Resetting for: {indexReset === -1 ? "None" : guestUsers[indexReset].username}
                </div>
                <TextField
                    // error={Boolean(touched.password && errors.password)}
                    fullWidth
                    label="Password"
                    margin="normal"
                    name="password"
                    type={showPasswordReset ? "text" : "password"}
                    value={resetPassword}
                    variant="outlined"
                    onChange={(x) => {
                        setResetPassword(x.target.value)
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPasswordReset}
                                    onMouseDown={handleMouseDownPasswordReset}
                                >
                                    {showPasswordReset ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Button
                    color="primary"
                    // disabled={isSubmitting}
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={handleResetPassword}
                >
                    CONFIRM
                </Button>
            </Box>


            <Box sx={{ pl: 7, mb: 3 }}>
                <Typography
                    color="textPrimary"
                    variant="h2"
                >
                    Delete Accounts
                </Typography>

            </Box>
        </div>
    )
}

const styles = {
    page: {
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems:"center",
        width: "100%",
        height: "100%",
        // borderStyle: "solid",
    },
    create : {
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems:"center",
        width: "100%",
        // borderStyle: "solid",
        fontSize: 20,
        paddingLeft: 10,
    },
    createInput: {
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        // alignItems:"center",
        width: "50%",
        // borderStyle: "solid",
        fontSize: 20,
        paddingLeft: 10,
    },
    manageVolunteers: {
        // paddingLeft: 30,
        height: 300,
        width: "100%",
        overflow: "hidden",
        overflowY: "scroll",

    },
    manageVolunteersItem: {
        // paddingLeft: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        // alignItems:"center",
        // height: 50,
        width: "100%",
        borderStyle: "solid",
        borderWidth: 2,
        marginBottom: 10,
        borderRadius: 5,
    },
    manageVolunteersItemButton: {
        borderRadius: 20,
        // background: "#6865bf",
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,

    },
    manageVolunteersDetails : {
        display: "flex",
        flexDirection: "column",
        paddingLeft: 10,
        paddingBottom: 5,
    },
}

export default ManageVolunteers;
