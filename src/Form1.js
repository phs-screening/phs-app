import React from "react";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";

function Form1() {
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => {
        console.log(data);
    }; // your form submit function which will invoke after successful validation

    console.log(watch("example")); // you can watch individual input by pass the name of the input

    return (
        <div>
            <h1>Form 1</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Name (as in NRIC): </label>
                <input
                    name="nameInput"
                    ref={register({ required: true })}
                />
                <label>Birthday: </label>
                <input
                    name="birthdayInput"
                    ref={register({ required: true })}
                />
                <label>Citizenship: </label>
                <select name="citizenshipInput" ref={register}>
                    <option value="sg">Singapore Citizen</option>
                    <option value="pr">Singapore Permanent Resident</option>
                    <option value="oth">Other</option>
                </select>
                <input type="submit" />
            </form>
        </div>
    );
}

export default Form1