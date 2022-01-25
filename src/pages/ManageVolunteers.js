import React, {useState} from "react";
import {
     Box, Typography, TextField, Button
} from '@material-ui/core';
import * as Yup from "yup";
import {Formik} from "formik";
import mongoDB from "../services/mongoDB";

//Create multiple accounts at once
const ManageVolunteers = () => {
    const [loading, isLoading] = useState(false);

    const handleCreateAccount = async (values) => {
        const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas")
        const guestProfiles = mongoConnection.db("phs").collection("profiles")
        isLoading(true)
        try {
            const searchUnique = await guestProfiles.findOne({username:values.email})

            if (searchUnique === null) {

                await guestProfiles.insertOne({
                    username: values.email,
                    password: values.password,
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
                                type="password"
                                value={values.password}
                                variant="outlined"
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
                    Manage Accounts
                </Typography>

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
    }
}

export default ManageVolunteers;
