import React, { useState, useEffect } from 'react'
import { getQueueCollection, getPreRegData, getSavedData, getProfile } from '../services/mongoDB'
import { Box, Button, Typography, TextField, CircularProgress } from '@material-ui/core'
import allForms from '../forms/forms.json'

const StationQueue = () => {
  const [loading, isLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [stationQueues, setStationQueues] = useState([])
  const [stationName, setStationName] = useState('')
  const [stationPatientAddId, setStationAddPatientId] = useState({})
  const [stationPatientRemoveId, setStationRemovePatientId] = useState({})

  const [admin, isAdmin] = useState(false)

  // Form a string of <id>: <salutation> <initials> for each patient id
  const getPatientStrings = async (patientIds) => {
    const patientStrings = await Promise.all(
      patientIds.map(async (id) => {
        const patient = await getPreRegData(id, 'patients')
        const registrationData = await getSavedData(id, allForms.registrationForm)
        const salutation = registrationData?.registrationQ1 ?? 'Mr/Mrs/Ms'
        const initials = patient?.initials ?? 'Not Found'

        return `${id}: ${salutation} ${initials}`
      }),
    )
    return patientStrings
  }

  // Handler for Add Station button
  const handleAddStation = async (event) => {
    event.preventDefault()
    isLoading(true)

    if (stationQueues.some((station) => station.stationName === stationName)) {
      alert('Station already exists, try entering a different name.')
      isLoading(false)
      return
    }

    const sq = getQueueCollection()
    const station = {
      stationName,
      queueItems: [],
    }

    await sq.insertOne(station)
    setRefresh(!refresh)
    setStationName('')
    isLoading(false)
  }

  // Handler for Delete Station button
  const handleDeleteStation = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const sq = getQueueCollection()
    await sq.deleteOne({ stationName })
    setRefresh(!refresh)
    isLoading(false)
  }

  // Handler for add station input field
  const handleChange = (event) => {
    const text = event.target.value
    setStationName(text)
  }

  // Handdler for add patient input field
  const handlePatientAddInput = (event) => {
    const text = event.target.value
    const stationName = event.target.name
    setStationAddPatientId({ ...stationPatientAddId, [stationName]: text })
  }

  // Handler for add patient button
  const handlePatientAdd = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const patientIdText = stationPatientAddId[stationName]
    const patientIds = patientIdText
      .trim()
      .split(' ')
      .filter((id) => !isNaN(parseInt(id)))
      .map((id) => parseInt(id))

    if (patientIds.length === 0) {
      alert('Patient ID must be a number.')
      isLoading(false)
      return
    }

    const patientStrings = await getPatientStrings(patientIds)
    const sq = getQueueCollection()
    await sq.findOneAndUpdate(
      { stationName },
      { $push: { queueItems: { $each: patientStrings } } },
      { upsert: true },
    )
    setRefresh(!refresh)
    setStationAddPatientId({ ...stationPatientAddId, [stationName]: '' })
    isLoading(false)
  }

  // Handler for remove patient input field
  const handlePatientRemoveInput = (event) => {
    const text = event.target.value
    const stationName = event.target.name
    setStationRemovePatientId({ ...stationPatientRemoveId, [stationName]: text })
  }

  // Handler for remove button (remove specific patient from queue)
  const handlePatientRemove = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const patientIdText = stationPatientRemoveId[stationName]
    const patientIds = patientIdText
      .trim()
      .split(' ')
      .filter((id) => !isNaN(parseInt(id)))
      .map((id) => parseInt(id))

    if (patientIds.length === 0) {
      alert('Patient ID must be a number.')
      isLoading(false)
      return
    }

    const patientStrings = await getPatientStrings(patientIds)
    const sq = getQueueCollection()
    // Read MongoDB documentation here:
    // https://www.mongodb.com/docs/manual/reference/operator/update/pullAll/
    await sq.findOneAndUpdate({ stationName }, { $pullAll: { queueItems: patientStrings } })

    setRefresh(!refresh)
    setStationRemovePatientId({ ...stationPatientRemoveId, [stationName]: '' })
    isLoading(false)
  }

  // Handler for remove first button (remove first patient from queue)
  const handlePatientRemoveFirst = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const sq = getQueueCollection()

    await sq.findOneAndUpdate({ stationName }, { $pop: { queueItems: -1 } }, { upsert: true })
    setRefresh(!refresh)
    isLoading(false)
  }

  // Handler for remove all button (remove all patients from queue)
  const handlePatientRemoveAll = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const sq = getQueueCollection()

    await sq.findOneAndUpdate({ stationName }, { $set: { queueItems: [] } }, { upsert: true })
    setRefresh(!refresh)
    isLoading(false)
  }

  // Set a listener to update the station queues when the refresh state changes
  useEffect(async () => {
    const collection = getQueueCollection()
    const sq = await collection.find()
    setStationQueues(sq)
  }, [refresh])

  // Update if user is admin (to show delete station button for admins)
  useEffect(async () => {
    const profile = await getProfile()
    if (profile !== null) {
      isAdmin(profile.is_admin)
    }
  }, [])

  return (
    <>
      <Typography
        color='textPrimary'
        gutterBottom
        variant='h3'
        sx={{
          marginBottom: '20px',
        }}
      >
        Stations
      </Typography>

      <TextField
        id='station-name'
        name='station-name'
        label='Add Station'
        type='text'
        placeholder='Enter station name'
        size='small'
        variant='outlined'
        onChange={handleChange}
        sx={{
          marginRight: '8px',
        }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Button color='primary' size='large' type='submit' onClick={handleAddStation}>
          Add
        </Button>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '32px',
          marginTop: '24px',
        }}
      >
        {stationQueues.map(({ stationName, queueItems }) => {
          return (
            <Box
              key={stationName}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '400px',
              }}
            >
              <Typography color='textPrimary' gutterBottom variant='h4'>
                {stationName}
              </Typography>

              <TextField
                id={stationName}
                name={stationName}
                label='Add Patient'
                type='text'
                placeholder='Enter one or more patient IDs, e.g. 1 2 3 4'
                size='small'
                variant='outlined'
                onChange={handlePatientAddInput}
              />

              <Button
                color='primary'
                size='large'
                type='submit'
                variant='contained'
                disabled={loading}
                onClick={(event) => handlePatientAdd(event, stationName)}
              >
                Add to back
              </Button>

              <br />

              <TextField
                id={stationName + '-remove'}
                name={stationName}
                label='Remove patient'
                type='text'
                placeholder='Enter one or more patient IDs, e.g. 1 2 3 4'
                size='small'
                variant='outlined'
                onChange={handlePatientRemoveInput}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  color='primary'
                  size='large'
                  type='submit'
                  disabled={loading}
                  onClick={(event) => handlePatientRemoveFirst(event, stationName)}
                  sx={{
                    flex: '1',
                  }}
                >
                  Remove First
                </Button>

                <Button
                  color='primary'
                  size='large'
                  type='submit'
                  disabled={loading}
                  onClick={(event) => handlePatientRemoveAll(event, stationName)}
                  sx={{
                    flex: '1',
                  }}
                >
                  Remove All
                </Button>

                <Button
                  color='primary'
                  size='large'
                  type='submit'
                  disabled={loading}
                  onClick={(event) => handlePatientRemove(event, stationName)}
                  sx={{
                    flex: '1',
                  }}
                >
                  Remove
                </Button>
              </Box>

              <Box
                sx={{
                  marginTop: '8px',
                  marginBottom: '16px',
                  height: '200px',
                  overflow: 'auto',
                }}
              >
                <div>Patient IDs in Queue:</div>
                {queueItems &&
                  queueItems.map((e) => {
                    return (
                      <div key={e}>
                        <strong>{e}</strong>
                      </div>
                    )
                  })}
              </Box>
              {admin && (
                <Button
                  color='error'
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  onClick={(event) => handleDeleteStation(event, stationName)}
                >
                  Delete Station
                </Button>
              )}
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default StationQueue
