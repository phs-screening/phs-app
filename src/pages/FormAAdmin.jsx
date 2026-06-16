import React, { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
  Pagination,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import {
  deleteFormAFromQueue,
  getPrintedFormAPdfQueue,
  getUnprintedFormAPdfQueue,
  markFormAAsPrinted,
} from '../services/printQueues'
import { getProfile } from '../services/authSession'
import { generateFormAPdf } from '../api/api.jsx'

const PRINT_QUEUE_PAGE_SIZE = 25

const formatLastRefreshed = (date) =>
  date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Never'

const buildQueueError = (message, error) =>
  error?.message ? `${message} Details: ${error.message}` : `${message} Please try again.`

const FormAAdmin = () => {
  const [pdfQueue, setPdfQueue] = useState([])
  const [printedQueue, setPrintedQueue] = useState([])
  const [queuePage, setQueuePage] = useState(1)
  const [historyPage, setHistoryPage] = useState(1)
  const [queuePagination, setQueuePagination] = useState(null)
  const [historyPagination, setHistoryPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true) // NEW
  const [view, setView] = useState('queue') // 'queue' = active jobs, 'history' = printed jobs
  const [searchPatientId, setSearchPatientId] = useState('')
  const [activePatientIdFilter, setActivePatientIdFilter] = useState('')
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null)
  const [fetchError, setFetchError] = useState('')

  const sortNewestFirst = (items) =>
    [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const fetchCurrentQueue = async (page = queuePage, patientId = activePatientIdFilter) => {
    const response = await getUnprintedFormAPdfQueue({
      page,
      limit: PRINT_QUEUE_PAGE_SIZE,
      patientId,
      includePagination: true,
    })
    setPdfQueue(sortNewestFirst(response.items))
    setQueuePagination(response.pagination)
    setQueuePage(response.pagination?.page || page)
    setLastRefreshedAt(new Date())
    setFetchError('')
  }

  const fetchPrintHistory = async (page = historyPage, patientId = activePatientIdFilter) => {
    const response = await getPrintedFormAPdfQueue({
      page,
      limit: PRINT_QUEUE_PAGE_SIZE,
      patientId,
      includePagination: true,
    })
    setPrintedQueue(sortNewestFirst(response.items))
    setHistoryPagination(response.pagination)
    setHistoryPage(response.pagination?.page || page)
    setLastRefreshedAt(new Date())
    setFetchError('')
  }

  // runs only on page load
  useEffect(() => {
    let isMounted = true
    const fetchProfileAndQueue = async () => {
      try {
        const profile = await getProfile()
        const isAdminUser = profile?.is_admin || false
        if (!isMounted) return

        // set admin state
        setAdmin(isAdminUser)
        setCheckingAdmin(false)

        if (!isAdminUser) return

        const response = await getUnprintedFormAPdfQueue({
          page: 1,
          limit: PRINT_QUEUE_PAGE_SIZE,
          includePagination: true,
        })

        if (!isMounted) return
        setPdfQueue(sortNewestFirst(response.items))
        setQueuePagination(response.pagination)
        setQueuePage(response.pagination?.page || 1)
        setLastRefreshedAt(new Date())
        setFetchError('')
        setLoading(false)
      } catch (err) {
        console.error('Initial fetch error:', err)
        setFetchError(buildQueueError('Unable to load the Form A PDF queue.', err))
        setCheckingAdmin(false)
        setLoading(false)
      }
    }

    fetchProfileAndQueue()
    return () => {
      isMounted = false
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      if (view === 'history') {
        await fetchPrintHistory()
      } else {
        await fetchCurrentQueue()
      }
    } catch (err) {
      console.error('Failed to refresh PDF queue:', err)
      setFetchError(buildQueueError('Unable to refresh the Form A PDF queue.', err))
    } finally {
      setRefreshing(false)
    }
  }

  const handleShowQueue = async () => {
    setView('queue')
    setRefreshing(true)
    try {
      await fetchCurrentQueue(1)
    } catch (err) {
      console.error('Failed to fetch current Form A queue:', err)
      setFetchError(buildQueueError('Unable to load the current Form A PDF queue.', err))
    } finally {
      setRefreshing(false)
    }
  }

  const handleShowHistory = async () => {
    setView('history')

    setRefreshing(true)
    try {
      await fetchPrintHistory()
    } catch (err) {
      console.error('Failed to fetch print history:', err)
      setFetchError(buildQueueError('Unable to load the Form A PDF print history.', err))
    } finally {
      setRefreshing(false)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    const nextFilter = searchPatientId.trim()

    if (nextFilter && !/^\d+$/.test(nextFilter)) {
      alert('Patient ID must be a number.')
      return
    }

    setActivePatientIdFilter(nextFilter)
    setRefreshing(true)

    try {
      if (view === 'history') {
        await fetchPrintHistory(1, nextFilter)
      } else {
        await fetchCurrentQueue(1, nextFilter)
      }
    } catch (err) {
      console.error('Failed to search Form A queue:', err)
      setFetchError(buildQueueError('Unable to search the Form A PDF queue.', err))
    } finally {
      setRefreshing(false)
    }
  }

  const handleClearSearch = async () => {
    setSearchPatientId('')
    setActivePatientIdFilter('')
    setRefreshing(true)

    try {
      if (view === 'history') {
        await fetchPrintHistory(1, '')
      } else {
        await fetchCurrentQueue(1, '')
      }
    } catch (err) {
      console.error('Failed to clear Form A queue search:', err)
      setFetchError(buildQueueError('Unable to clear the Form A PDF queue search.', err))
    } finally {
      setRefreshing(false)
    }
  }

  const handlePrint = async (entry) => {
    setRefreshing(true)
    try {
      await generateFormAPdf(entry.patientId)
      await markFormAAsPrinted(entry._id)
      await fetchCurrentQueue()
    } catch (error) {
      console.error('Failed to generate Form A PDF:', error)
      setFetchError(buildQueueError('Unable to print and update the Form A PDF queue.', error))
      alert('Unable to generate Form A PDF because backend station eligibility is unavailable.')
    } finally {
      setRefreshing(false)
    }
  }

  const handleReprint = async (patientId) => {
    try {
      await generateFormAPdf(patientId)
    } catch (error) {
      console.error('Failed to generate Form A PDF:', error)
      alert('Unable to generate Form A PDF because backend station eligibility is unavailable.')
    }
  }

  // Update the handleRemove function:
  const handleRemove = async (entry) => {
    setRefreshing(true)
    try {
      await deleteFormAFromQueue(entry._id)
      await fetchCurrentQueue()
    } catch (err) {
      console.error('Failed to remove Form A queue entry:', err)
      setFetchError(buildQueueError('Unable to remove the Form A PDF queue entry.', err))
    } finally {
      setRefreshing(false)
    }
  }

  const handlePageChange = async (_event, page) => {
    setRefreshing(true)
    try {
      if (view === 'history') {
        await fetchPrintHistory(page)
      } else {
        await fetchCurrentQueue(page)
      }
    } catch (err) {
      console.error('Failed to change PDF queue page:', err)
      setFetchError(buildQueueError('Unable to load that Form A PDF queue page.', err))
    } finally {
      setRefreshing(false)
    }
  }

  const activePagination = view === 'history' ? historyPagination : queuePagination
  const activePage = view === 'history' ? historyPage : queuePage

  if (checkingAdmin) return <CircularProgress />

  if (!admin) return <Typography variant='h6'>Access denied. Admins only.</Typography>

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant='h4' gutterBottom>
        Form A PDF Print Queue
      </Typography>

      <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant={view === 'queue' ? 'contained' : 'outlined'}
          onClick={handleShowQueue}
        >
          Show Current Queue
        </Button>
        <Button variant={view === 'history' ? 'contained' : 'outlined'} onClick={handleShowHistory}>
          Show Print History
        </Button>
        <Button variant='outlined' onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
        <Typography variant='body2' color='text.secondary'>
          Last refreshed: {formatLastRefreshed(lastRefreshedAt)}
        </Typography>
      </Stack>

      {fetchError && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      <Box component='form' onSubmit={handleSearch} sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <TextField
            label='Search patient ID'
            size='small'
            value={searchPatientId}
            onChange={(event) => setSearchPatientId(event.target.value)}
            sx={{ width: { xs: '100%', sm: 240 } }}
          />
          <Button type='submit' variant='contained' disabled={refreshing}>
            Search
          </Button>
          <Button type='button' variant='outlined' onClick={handleClearSearch} disabled={refreshing}>
            Clear
          </Button>
        </Stack>
        {activePatientIdFilter && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            Showing records for patient ID {activePatientIdFilter}
          </Typography>
        )}
      </Box>

      {loading || refreshing ? (
        <CircularProgress />
      ) : view === 'history' ? (
        printedQueue.length === 0 ? (
          <Typography>
            {activePatientIdFilter
              ? `No printed records found for patient ID ${activePatientIdFilter}.`
              : 'No printed records found.'}
          </Typography>
        ) : (
          printedQueue.map((entry) => (
            <Paper
              key={entry._id}
              sx={{
                padding: 2,
                marginBottom: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant='subtitle1'>Patient ID: {entry.patientId}</Typography>
                <Typography variant='body2'>
                  Created At: {new Date(entry.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Button variant='outlined' onClick={() => handleReprint(entry.patientId)}>
                Reprint
              </Button>
            </Paper>
          ))
        )
      ) : (
        pdfQueue.length === 0 ? (
          <Typography>
            {activePatientIdFilter
              ? `No current queue records found for patient ID ${activePatientIdFilter}.`
              : 'No current queue records found.'}
          </Typography>
        ) : (
          pdfQueue.map((entry) => (
            <Paper
              key={entry._id}
              sx={{
                padding: 2,
                marginBottom: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant='subtitle1'>Patient ID: {entry.patientId}</Typography>
                <Typography variant='body2'>
                  Created At: {new Date(entry.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Stack direction='row' spacing={1}>
                <Button variant='contained' color='primary' onClick={() => handlePrint(entry)}>
                  Print
                </Button>
                <Button variant='outlined' color='error' onClick={() => handleRemove(entry)}>
                  Remove
                </Button>
              </Stack>
            </Paper>
          ))
        )
      )}

      {!loading && !refreshing && activePagination?.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={activePagination.totalPages}
            page={activePage}
            onChange={handlePageChange}
            color='primary'
          />
        </Box>
      )}
    </Box>
  )
}

export default FormAAdmin
