import React, { useState, useEffect } from 'react'
import { getQueueCollection, getPreRegData, getSavedData, getProfile } from '../services/mongoDB'
import { Box, Button, Typography, TextField, CircularProgress } from '@material-ui/core'
import allForms from '../forms/forms.json'

const StationQueue = () => {
  const [loading, isLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [stationQueues, setStationQueues] = useState([])
  const [stationName, setStationName] = useState('')
  const [stationPatientId, setStationPatientId] = useState({})

  const [admin, isAdmin] = useState(false)

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

  const handleDeleteStation = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const sq = getQueueCollection()
    await sq.deleteOne({ stationName })
    setRefresh(!refresh)
    isLoading(false)
  }

  const handleChange = (event) => {
    const text = event.target.value
    setStationName(text)
  }

  const handlePatientInput = (event) => {
    const text = event.target.value
    const stationName = event.target.name
    setStationPatientId({ ...stationPatientId, [stationName]: text })
  }

  const handlePatientAdd = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const patientIdText = stationPatientId[stationName]
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

    const patientStrings = await Promise.all(
      patientIds.map(async (id) => {
        const patient = await getPreRegData(id, 'patients')
        const registrationData = await getSavedData(id, allForms.registrationForm)
        const salutation = registrationData?.registrationQ1 ?? 'Mr/Mrs/Ms'
        const initials = patient?.initials ?? 'Not Found'

        return `${id}: ${salutation} ${initials}`
      }),
    )

    const sq = getQueueCollection()
    await sq.findOneAndUpdate(
      { stationName },
      { $push: { queueItems: { $each: patientStrings } } },
      { upsert: true },
    )
    setRefresh(!refresh)
    setStationPatientId({ ...stationPatientId, [stationName]: '' })
    isLoading(false)
  }

  const handlePatientRemove = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const sq = getQueueCollection()

    await sq.findOneAndUpdate({ stationName }, { $pop: { queueItems: -1 } }, { upsert: true })
    setRefresh(!refresh)
    isLoading(false)
  }

  const handlePatientRemoveAll = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const sq = getQueueCollection()

    await sq.findOneAndUpdate({ stationName }, { $set: { queueItems: [] } }, { upsert: true })
    setRefresh(!refresh)
    isLoading(false)
  }

  useEffect(async () => {
    const collection = getQueueCollection()
    const sq = await collection.find()
    setStationQueues(sq)
  }, [refresh])

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
                  onClick={(event) => handlePatientRemove(event, stationName)}
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
              </Box>

              <TextField
                id={stationName}
                name={stationName}
                label='Add Patient'
                type='text'
                placeholder='Enter one or more patient IDs, e.g. 1 2 3 4'
                size='small'
                variant='outlined'
                onChange={handlePatientInput}
              />

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
