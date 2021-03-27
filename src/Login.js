import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import './Login.css';


function Login() {
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => {
        console.log(data);
    }; // your form submit function which will invoke after successful validation

    console.log(watch("example")); // you can watch individual input by pass the name of the input

    return (
        <div>
            <h1>Welcome to PHS!</h1>
            <h3>Please log in to continue.</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Username: </label>
                <input
                    name="usernameInput"
                    ref={register({ required: true })}
                />
                {errors.usernameInput && <p>Please enter username!</p>}
                <label>Password: </label>
                <input
                    name="passwordInput"
                    ref={register({ required: true })}
                />
                {errors.passwordInput && <p>Please enter password!</p>}
                <input type="submit" />
            </form>
        </div>
    );
}

export default Login