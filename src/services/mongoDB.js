import * as Realm from 'realm-web'

const REALM_APP_ID = process.env.REACT_APP_MONGO_KEY
// contact developer for .env file for key
const app = new Realm.App({ id: REALM_APP_ID })

export default app

export const getName = () => {
  // admins have email, guests have name
  return app.currentUser.profile.name === undefined
    ? app.currentUser.profile.email
    : app.currentUser.profile.name
}

export const isLoggedin = () => {
  return app.currentUser !== null && app.currentUser.accessToken
}

export const logOut = () => {
  return app.currentUser.logOut()
}

export const guestUserCount = async () => {
  const query = await app.currentUser
    .mongoClient('mongodb-atlas')
    .db('phs')
    .collection('profiles')
    .count({ is_admin: null })
  return query
}

export const hashPassword = async (password) => {
  const encoder = new TextEncoder()
  const encodePassword = encoder.encode(password)
  const hashPassword = await crypto.subtle.digest('SHA-256', encodePassword)
  const hashArray = Array.from(new Uint8Array(hashPassword))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}
export const profilesCollection = () => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const userProfile = mongoConnection.db('phs').collection('profiles')
  return userProfile
}

export const getQueueCollection = () => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const queue = mongoConnection.db('phs').collection('queue')
  return queue
}

export const getProfile = async () => {
  if (isLoggedin()) {
    const profile = await app.currentUser
      .mongoClient('mongodb-atlas')
      .db('phs')
      .collection('profiles')
      .findOne({ username: getName() })
    return profile
  }

  return null
}

export const isAdmin = async () => {
  // admins have email, guests do not
  if (isLoggedin()) {
    return app.currentUser.profile.email !== undefined
  }
  return false
}

// export const isValidQueueNo = async (queueNo) => {
//     const mongoConnection = app.currentUser.mongoClient("mongodb-atlas");
//     const patientsRecord = mongoConnection.db("phs").collection("patients");
//     const record = await patientsRecord.findOne({queueNo});
//     return record !== null;
// }

export const getAllPatientNames = async (collectionName) => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const data = await mongoConnection
    .db('phs')
    .collection(collectionName)
    .find({}, { projection: { initials: 1, _id: 0 } })
  return data === null ? {} : data
}

export const getSavedData = async (patientId, collectionName) => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const savedData = await mongoConnection
    .db('phs')
    .collection(collectionName)
    .findOne({ _id: patientId })
  return savedData === null ? {} : savedData
}

export const getPreRegDataById = async (patientId, collectionName) => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const savedData = await mongoConnection
    .db('phs')
    .collection(collectionName)
    .findOne({ queueNo: patientId })
  return savedData === null ? {} : savedData
}

export const getPreRegDataByName = async (patientName, collectionName) => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const savedData = await mongoConnection
    .db('phs')
    .collection(collectionName)
    .findOne({ initials: patientName })
  return savedData === null ? {} : savedData
}
export const getSavedPatientData = async (patientId, collectionName) => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const savedData = await mongoConnection
    .db('phs')
    .collection(collectionName)
    .findOne({ queueNo: patientId })
  return savedData === null ? {} : savedData
}

export const getClinicSlotsCollection = () => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  const phlebCounters = mongoConnection.db('phs').collection('queueCounters')
  return phlebCounters
}

export const updatePhlebotomyCounter = async (seq) => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  await mongoConnection
    .db('phs')
    .collection('queueCounters')
    .updateOne({ _id: 'phlebotomyQ3' }, { $set: { seq } })
  return
}

export const updateStationCounts = async (patientId, visitedStationsCount, eligibleStationsCount) => {
  const mongoConnection = app.currentUser.mongoClient('mongodb-atlas')
  await mongoConnection
    .db('phs')
    .collection('patients')
    .updateOne(
      { queueNo: patientId },
      { $set: { visitedStationsCount, eligibleStationsCount } }
  )
}
