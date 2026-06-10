import React, { useState, useEffect } from 'react'
import {
  addPatientsToStationQueue,
  createStationQueue,
  deleteStationQueue,
  getQueueEntries,
  removeFirstPatientFromStationQueue,
  removePatientsFromStationQueue,
} from '../api/queuesApi'
import { getProfile } from '../services/authSession'
import { getPreRegDataById, getSavedData } from '../services/patientData'
import {
  Box,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Tooltip,
  Paper,
  Divider,
} from '@mui/material'
import allForms from '../forms/forms.json'

const parseQueueItem = (queueItem) => {
  const [idPart, ...nameParts] = String(queueItem).split(':')
  const id = idPart.trim()
  const name = nameParts.join(':').trim()

  return {
    id,
    name: name || queueItem,
  }
}

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
        const patient = await getPreRegDataById(id, 'patients')
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

    await createStationQueue(stationName)
    setRefresh(!refresh)
    setStationName('')
    isLoading(false)
  }

  // Handler for Delete Station button
  const handleDeleteStation = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    await deleteStationQueue(stationName)
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

  const getExistingQueuePatientIds = (stationName) => {
    const station = stationQueues.find((station) => station.stationName === stationName)
    if (!station?.queueItems?.length) {
      return new Set()
    }

    return new Set(
      station.queueItems
        .map((item) => {
          const id = parseInt(item.split(':')[0], 10)
          return Number.isFinite(id) ? id : null
        })
        .filter((id) => id !== null),
    )
  }

  // Handler for add patient button
  const handlePatientAdd = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    const patientIdText = stationPatientAddId[stationName]

    if (!patientIdText || patientIdText.trim() === '') {
      alert('Patient ID must be a number.')
      isLoading(false)
      return
    }

    const rawPatientIds = patientIdText
      .trim()
      .split(/\s+/)
      .filter((id) => !isNaN(parseInt(id)))
      .map((id) => parseInt(id))

    const uniquePatientIds = Array.from(new Set(rawPatientIds))
    const duplicateEnteredIds = rawPatientIds.filter(
      (id, index) => rawPatientIds.indexOf(id) !== index,
    )

    if (duplicateEnteredIds.length > 0) {
      alert(
        `Duplicate patient IDs entered and ignored: ${Array.from(new Set(duplicateEnteredIds)).join(
          ', ',
        )}`,
      )
    }

    if (uniquePatientIds.length === 0) {
      alert('Patient ID must be a number.')
      isLoading(false)
      return
    }

    const existingQueueIds = getExistingQueuePatientIds(stationName)
    const duplicateExisting = uniquePatientIds.filter((id) => existingQueueIds.has(id))

    if (duplicateExisting.length > 0) {
      alert(`Patient ID(s) ${duplicateExisting.join(', ')} already exist in this station queue.`)
    }

    const newPatientIds = uniquePatientIds.filter((id) => !existingQueueIds.has(id))

    if (newPatientIds.length === 0) {
      isLoading(false)
      return
    }

    const patientStrings = await getPatientStrings(newPatientIds)
    await addPatientsToStationQueue(stationName, patientStrings)
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

    if (!patientIdText || patientIdText.trim() === '') {
      alert('Patient ID must be a number.')
      isLoading(false)
      return
    }

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
    await removePatientsFromStationQueue(stationName, patientStrings)

    setRefresh(!refresh)
    setStationRemovePatientId({ ...stationPatientRemoveId, [stationName]: '' })
    isLoading(false)
  }

  // Handler for remove first button (remove first patient from queue)
  const handlePatientRemoveFirst = async (event, stationName) => {
    event.preventDefault()
    isLoading(true)

    await removeFirstPatientFromStationQueue(stationName)
    setRefresh(!refresh)
    isLoading(false)
  }

  // Set a listener to update the station queues when the refresh state changes
  useEffect(() => {
    const updateStationQueue = async () => {
      const response = await getQueueEntries()
      setStationQueues(response.data || [])
    }
    updateStationQueue()
  }, [refresh])

  // Update if user is admin (to show delete station button for admins)
  useEffect(() => {
    const showDeleteForAdmins = async () => {
      const profile = await getProfile()
      if (profile !== null) {
        isAdmin(profile.is_admin)
      }
    }
    showDeleteForAdmins()
  }, [])

  return (
    <Box sx={{ p: 3, bgcolor: '#f7f8fb', minHeight: '100vh' }}>
      <Typography
        color='textPrimary'
        gutterBottom
        variant='h3'
        sx={{ marginBottom: 3, fontWeight: 700 }}
      >
        Station Queue Management
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 2,
          bgcolor: '#fff',
          maxWidth: '100%',
        }}
      >
        <TextField
          id='station-name'
          name='station-name'
          label='Station Name'
          type='text'
          placeholder='Enter station name'
          size='small'
          variant='outlined'
          onChange={handleChange}
          value={stationName}
          sx={{ flex: 1, minWidth: 0 }}
        />

        {admin && (
          <Button
            color='primary'
            variant='contained'
            type='submit'
            onClick={handleAddStation}
            disabled={loading || !stationName.trim()}
            sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            Add Station
          </Button>
        )}
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(420px, 1fr))' },
          gap: 3,
        }}
      >
        {stationQueues.map(({ stationName, queueItems }) => (
          <Paper
            key={stationName}
            elevation={3}
            sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fff' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Tooltip title={stationName}>
                <Typography
                  variant='h5'
                  sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {stationName}
                </Typography>
              </Tooltip>
              <Typography variant='caption' color='text.secondary'>
                {queueItems?.length || 0} in queue
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                id={`${stationName}-add`}
                name={stationName}
                label='Add patient IDs'
                type='text'
                placeholder='e.g. 1 2 3 4'
                size='small'
                variant='outlined'
                value={stationPatientAddId[stationName] || ''}
                onChange={handlePatientAddInput}
                fullWidth
              />
              <Button
                color='primary'
                size='large'
                type='submit'
                variant='contained'
                disabled={loading}
                onClick={(event) => handlePatientAdd(event, stationName)}
                sx={{ textTransform: 'none' }}
              >
                Add to Back
              </Button>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                id={`${stationName}-remove`}
                name={stationName}
                label='Remove patient IDs'
                type='text'
                placeholder='e.g. 1 2 3 4'
                size='small'
                variant='outlined'
                value={stationPatientRemoveId[stationName] || ''}
                onChange={handlePatientRemoveInput}
                fullWidth
              />
              <Box
                sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}
              >
                <Button
                  color='primary'
                  size='large'
                  type='submit'
                  variant='outlined'
                  disabled={loading}
                  onClick={(event) => handlePatientRemoveFirst(event, stationName)}
                  sx={{ textTransform: 'none' }}
                >
                  Remove First
                </Button>
                <Button
                  color='primary'
                  size='large'
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  onClick={(event) => handlePatientRemove(event, stationName)}
                  sx={{ textTransform: 'none' }}
                >
                  Remove
                </Button>
              </Box>
            </Box>

            <Divider />

            <Box
              sx={{ p: 2, bgcolor: '#f4f6fa', borderRadius: 1, minHeight: 180, overflow: 'auto' }}
            >
              <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 600 }}>
                Patients in Queue
              </Typography>
              {queueItems && queueItems.length > 0 ? (
                queueItems.map((patientId, index) => {
                  const patient = parseQueueItem(patientId)

                  return (
                    <Box
                      key={`${patientId}-${index}`}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'auto minmax(0, 1fr) auto',
                        alignItems: 'center',
                        gap: 1.5,
                        bgcolor: '#fff',
                        p: 1,
                        mb: 1,
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          fontWeight: 700,
                          color: 'primary.main',
                          minWidth: 32,
                          textAlign: 'center',
                        }}
                      >
                        #{index + 1}
                      </Typography>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {patient.name}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        id: {patient.id}
                      </Typography>
                    </Box>
                  )
                })
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  No patients in queue yet.
                </Typography>
              )}
            </Box>

            {admin && (
              <Button
                color='error'
                size='large'
                type='submit'
                variant='contained'
                disabled={loading}
                onClick={(event) => handleDeleteStation(event, stationName)}
                sx={{ textTransform: 'none' }}
              >
                Delete Station
              </Button>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  )
}

export default StationQueue
