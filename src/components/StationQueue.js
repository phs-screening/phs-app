import React, { useState, useEffect } from 'react'
import { getQueueCollection } from '../services/mongoDB'
import { Box, Button, Typography, TextField, CircularProgress } from '@material-ui/core'

const StationQueue = () => {
  const [loading, isLoading] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [stationQueues, setStationQueues] = useState([])
  const [stationName, setStationName] = useState('')
  const [stationPatientId, setStationPatientId] = useState({})

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
      .split(' ')
      .filter((id) => !isNaN(parseInt(id)))
      .map((id) => parseInt(id))

    if (patientIds.length === 0) {
      alert('Patient ID must be a number.')
      isLoading(false)
      return
    }

    const sq = getQueueCollection()
    await sq.findOneAndUpdate(
      { stationName },
      { $push: { queueItems: { $each: patientIds } } },
      { upsert: true },
    )
    setRefresh(!refresh)
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

  useEffect(async () => {
    const collection = getQueueCollection()
    const sq = await collection.find()
    setStationQueues(sq)
  }, [refresh])

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
                onClick={(event) => handlePatientAdd(event, stationName)}
              >
                Add to back
              </Button>
              <Button
                color='primary'
                size='large'
                type='submit'
                onClick={(event) => handlePatientRemove(event, stationName)}
              >
                Remove First
              </Button>

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
                }}
              >
                <div>Patient IDs in Queue:</div>
                <strong>{Array.isArray(queueItems) && queueItems.join(' ')}</strong>
              </Box>

              <Button
                color='error'
                size='large'
                type='submit'
                variant='contained'
                onClick={(event) => handleDeleteStation(event, stationName)}
              >
                Delete Station
              </Button>
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default StationQueue
