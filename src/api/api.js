const axios = require('axios').default;


export async function preRegister(preRegArgs) {
    let gender = preRegArgs.gender;
    let initials = preRegArgs.initials;
    let abbreviatedNric = preRegArgs.abbreviatedNric;
    let goingForPhlebotomy = preRegArgs.goingForPhlebotomy;
    // validate params
    if (gender == null || initials == null || abbreviatedNric == null || goingForPhlebotomy == null) {
        return {"result": false, "error": "Function Arguments canot be undefined."};
    }
    if (typeof goingForPhlebotomy === 'string' && goingForPhlebotomy !== 'Y' && goingForPhlebotomy !== 'N') {
        return {"result": false, "error": "The value of goingForPhlebotomy must either be \"T\" or \"F\""};
    }
    // TODO: more exhaustive error handling. consider abstracting it in a validation function, and using schema validation
    try {
        var response = await axios.post(`/api/forms/preRegistrationQ`, {
            "gender": gender,
            "initials": initials, 
            "abbreviatedNric": abbreviatedNric,
            "goingForPhlebotomy": goingForPhlebotomy
        });
    } catch(err) {
        // TODO: more granular error handling
        console.log(err);
        return {"result": false, "error": err}
    }
    return {"result": true, "data": response.data};
}

// Provides general information about the kinds of forms that are supported
export async function getFormInfo() {
    try {
        var response = await axios.get(`/api/forms/info`);
    } catch(err) {
        // TODO: more granular error handling
        return {"result": false, "error": err}
    }
    return {"result": true, "data": response.data.data};
}

// retrieve completion status of all forms. green for completed, red for not complete, and amber for incomplete
export async function getFormStatus(userID) {
    userID = parseInt(userID)
    if (Number.isNaN(userID)) {
        return {"result": false, "error": "User ID cannot be undefined."};
    }
    try {
        var response = await axios.get(`/api/users/${userID}/status`);
    } catch(err) {
        // TODO: more granular error handling
        return {"result": false, "error": err}
    }
    return {"result": true, "data": response.data};
}

// retrieve specific form data
export async function getIndividualFormData(userID, form) {
    userID = parseInt(userID)
    if (Number.isNaN(userID)) {
        return {"result": false, "error": "User ID cannot be undefined."};
    }
    // TODO: use getFormInfo() to validate form name
    try {
        var response = await axios.get(`/api/users/${userID}/forms/${form}`);
    } catch(err) {
        // TODO: more granular error handling
        return {"result": false, "error": err}
    }
    return {"result": true, "data": response.data};
}

// retrieve all form data
export async function getAllFormData(userID) {
    userID = parseInt(userID)
    if (Number.isNaN(userID)) {
        return {"result": false, "error": "User ID cannot be undefined."};
    }
    try {
        var response = await axios.get(`/api/users/${userID}/forms`);
    } catch(err) {
        // TODO: more granular error handling
        return {"result": false, "error": err}
    }
    return {"result": true, "data": response.data};
}

// update or insert (upsert) data for a specified form
export async function upsertIndividualFormData(userID, form_name, form_data) {
    userID = parseInt(userID)
    if (Number.isNaN(userID)) {
        return {"result": false, "error": "User ID cannot be undefined."};
    }
    // TODO: use getFormInfo() to validate form name. 
    try {
        var response = await axios.post(`/api/users/${userID}/forms/${form_name}`, {
            "form_data": JSON.stringify(form_data)
        });
    } catch(err) {
        // TODO: more granular error handling
        return {"result": false, "error": err}
    }
    return {"result": true, "data": response.data};
}
