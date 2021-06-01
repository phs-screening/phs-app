import React from "react";
import { useForm } from "react-hook-form";
import './Login.css';


function LoginForm() {
    const { register, handleSubmit, watch } = useForm();
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
                <input {...register('usernameInput', { required: true })} />
                <label>Password: </label>
                <input {...register('passwordInput', { required: true })} />
                <input type="submit" />
            </form>
        </div>
    );
}

export default LoginForm