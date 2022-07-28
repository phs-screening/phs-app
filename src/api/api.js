import mongoDB, {getName, isAdmin} from "../services/mongoDB";
import {blueText, redText, blueRedText} from 'src/theme/commonComponents.js';
import { blue } from "@material-ui/core/colors";

const axios = require('axios').default;

export async function preRegister(preRegArgs) {
    let gender = preRegArgs.gender;
    let fullName = preRegArgs.fullName.trim();
    let fullNric = preRegArgs.fullNric.trim().toUpperCase();
    let fullAddress = preRegArgs.fullAddress.trim();
    let fullPostal = preRegArgs.fullPostal.trim()
    let dateOfBirth = preRegArgs.dateOfBirth.trim();
    let contactNumber = preRegArgs.contactNumber.trim();
    let preferredLanguage = preRegArgs.preferredLanguage.trim()
    let goingForPhlebotomy = preRegArgs.goingForPhlebotomy;
    // validate params
    if (gender == null || fullName == null || fullNric == null || fullAddress == null ||
        fullPostal == null || dateOfBirth == null || contactNumber == null || preferredLanguage == null
        || goingForPhlebotomy == null) {
        return {"result": false, "error": "Function Arguments canot be undefined."};
    }
    if (typeof goingForPhlebotomy === 'string' && goingForPhlebotomy !== 'Y' && goingForPhlebotomy !== 'N') {
        return {"result": false, "error": "The value of goingForPhlebotomy must either be \"T\" or \"F\""};
    }
    // TODO: more exhaustive error handling. consider abstracting it in a validation function, and using schema validation
    let data = {
        "gender": gender,
        "initials": fullName,
        "fullNric": fullNric,
        "fullAddress": fullAddress,
        "fullPostal": fullPostal,
        "dateOfBirth": dateOfBirth,
        "contactNumber": contactNumber,
        "preferredLanguage" :preferredLanguage,
        "goingForPhlebotomy": goingForPhlebotomy
    }
    let isSuccess = false;
    let errorMsg = "";
    try {
        const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas");
        const patientsRecord = mongoConnection.db("phs").collection("patients");
        const record = await patientsRecord.find({fullNric});
        if (record.length === 0) {
            const qNum = await mongoDB.currentUser.functions.getNextQueueNo();
            await patientsRecord.insertOne({queueNo: qNum, ...data});
            data = {patientId: qNum, ...data};
            isSuccess = true;
        } else {
            errorMsg = "There exists a patient with the same NRIC.\n"
                + "Please check that the patient has not registered yet.\nReport to the admin"
                + " if there is no mistake as we need a way to identify the patients.";
        }
    } catch(err) {
        // TODO: more granular error handling
        return {"result": false, "error": err}
    }
    return {"result": isSuccess, "data": data, "error": errorMsg};
}

export async function submitForm(args, patientId, formCollection) {
    try {
        const mongoConnection = mongoDB.currentUser.mongoClient("mongodb-atlas");
        const patientsRecord = mongoConnection.db("phs").collection("patients");
        const record = await patientsRecord.findOne({queueNo: patientId});
        if (record) {
            const registrationForms = mongoConnection.db("phs").collection(formCollection);
            if (record[formCollection] === undefined) {
                // first time form is filled, create document for form
                await registrationForms.insertOne({_id: patientId, ...args});
                await patientsRecord.updateOne({queueNo: patientId}, {$set : {[formCollection] : patientId}});
                return { "result" : true };
            } else {
                if (await isAdmin()) {
                    args.lastEdited = new Date()
                    args.lastEditedBy = getName()
                    await registrationForms.updateOne({_id : patientId}, {$set : {...args}})
                    // replace form
                    // registrationForms.findOneAndReplace({_id: record[formCollection]}, args);
                    // throw error message
                    // const errorMsg = "This form has already been submitted. If you need to make "
                    //         + "any changes, please contact the admin."
                    return { "result" : true };

                } else {
                    const errorMsg = "This form has already been submitted. If you need to make "
                            + "any changes, please contact the admin."
                    return { "result" : false, "error" : errorMsg };
                }

            }
        } else {    
            // TODO: throw error, not possible that no document is found
            // unless malicious user tries to change link to directly access reg page
            // Can check in every form page if there is valid patientId instead
            // cannot use useEffect since the form component is class component
            const errorMsg = "An error has occurred."
            // You will be directed to the registration page." logic not done
            return { "result" : false, "error" : errorMsg };
        }
    } catch(err) {
        return { "result" : false, "error" : err };
    }
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

// Calcuates the BMI 
export function calculateBMI(heightInCm, weightInKg) {
    const height = heightInCm / 100;
    const bmi = ((weightInKg / height) / height).toFixed(1).toString();

	if (bmi >= 23.0) {
		return redText(bmi + "\nBMI is overweight");
	} else if (bmi <= 18.6) {
		return redText(bmi + "\nBMI is underweight");
	} else {
		return blueText(bmi);
	}
}

// Formats the response for the geri vision section
export function formatGeriVision(acuity, questionNo) {
	const acuityInNumber = Number(acuity)
	var result;
	var additionalInfo;

	switch (questionNo) {
		case 3:
		case 4:
			if (acuityInNumber >= 6) {
				additionalInfo = "\nSee VA with pinhole"
				result = "Visual acuity (w/o pinhole occluder) - Right Eye 6/" + acuity
				result = redText(result + additionalInfo)
			} else {
				result = "Visual acuity (w/o pinhole occluder) - Left Eye 6/" + acuity
				result = blueText(result)
			}

			return result;
		case 5:
		case 6:
			if (acuityInNumber >= 6) {
				result = "Visual acuity (with pinhole occluder) - Right Eye 6/" + acuity
				additionalInfo = "\nNon-refractive error, participant should have consulted on-site doctor"
			} else {
				result = "Visual acuity (with pinhole occluder) - Left Eye 6/" + acuity
				additionalInfo = "\nRefractive error, participant should have received spectacles vouchers"
			}
			result = redText(result + additionalInfo)

			return result;
	}
	
}

export function formatWceStation(gender, question, answer) {
	if (gender == "Male" || gender == "Not Applicable") {
		return "-";
	}

	var result = answer;
	var additionalInfo;
	switch (question) {
		case 2:
		case 3:
			additionalInfo = "If participant is interested in WCE, check whether they have"
				      		 + "completed the station. Referring to the responses below, please check with them if the relevant appointments have been made based on their indicated interests."
			break;
		case 4:
			if (answer == "Yes") {
				additionalInfo = "Kindly remind participant that SCS will be contacting them."
			}
			break;
		case 5:
			if (answer == "Yes") {
				additionalInfo = "Kindly remind participant that SCS will be contacting them."
			}
			break;
		case 6:
			if (answer == "Yes") {
				additionalInfo = "Kindly remind participant that NHGD will be contacting them."
			}
			break;
	}

	result = blueRedText(result, additionalInfo);
	return result;
}



