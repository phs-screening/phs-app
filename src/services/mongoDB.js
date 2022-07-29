import * as Realm from "realm-web";

const REALM_APP_ID = process.env.REACT_APP_MONGO_KEY;

const app = new Realm.App({ id: REALM_APP_ID });

export default app;

export const getName = () => {
    return app.currentUser.profile.name === undefined ? app.currentUser.profile.email : app.currentUser.profile.name
}

export const isLoggedin = () => {
    return app.currentUser !== null && app.currentUser.accessToken
}

export const logOut = () => {
    return app.currentUser.logOut()
}

export const guestUserCount = async () => {
    const query = await app.currentUser.mongoClient("mongodb-atlas")
        .db("phs").collection("profiles").count({is_admin: null})
    return query
}

export const hashPassword = async (password) => {
    const encoder = new TextEncoder()
    const encodePassword = encoder.encode(password)
    const hashPassword = await crypto.subtle.digest('SHA-256', encodePassword);
    const hashArray = Array.from(new Uint8Array(hashPassword))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
}
export const profilesCollection = () => {
    const mongoConnection = app.currentUser.mongoClient("mongodb-atlas")
    const userProfile = mongoConnection.db("phs").collection("profiles")
    return userProfile
}


export const getProfile = async (type) => {
    if (isLoggedin()) {
            const profile = await app.currentUser.mongoClient("mongodb-atlas")
                .db("phs").collection("profiles").findOne({username: getName()})
            return profile
    }

    return null;
}

export const isAdmin = async (type) => {
    if (isLoggedin()) {
        const profile = await app.currentUser.mongoClient("mongodb-atlas")
            .db("phs").collection("profiles").findOne({username: getName()})

        return profile.is_admin
    }
    return false;
}

export const isValidQueueNo = async (queueNo) => {
    const mongoConnection = app.currentUser.mongoClient("mongodb-atlas");
    const patientsRecord = mongoConnection.db("phs").collection("patients");
    const record = await patientsRecord.findOne({queueNo});
    return record !== null;
}

export const getSavedData = async (patientId, collectionName) => {
    const mongoConnection = app.currentUser.mongoClient("mongodb-atlas");
    const savedData = await mongoConnection.db("phs").collection(collectionName).findOne({_id : patientId});
    return savedData === null ? {} : savedData
}

export const getPreRegData = async (patientId, collectionName) => {
    const mongoConnection = app.currentUser.mongoClient("mongodb-atlas");
    const savedData = await mongoConnection.db("phs").collection(collectionName).findOne({queueNo : patientId});
    return savedData === null ? {} : savedData
}
export const getSavedPatientData = async (patientId, collectionName) => {
    const mongoConnection = app.currentUser.mongoClient("mongodb-atlas");
    const savedData = await mongoConnection.db("phs").collection(collectionName).findOne({queueNo : patientId});
    return savedData === null ? {} : savedData
}
