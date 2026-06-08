import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, Typography, Pagination, Paper, Stack } from '@mui/material'
import {
  deleteFormAFromQueue,
  getPrintedFormAPdfQueue,
  getUnprintedFormAPdfQueue,
  markFormAAsPrinted,
} from '../services/printQueues'
import { getProfile } from '../services/authSession'
import { generateFormAPdf } from '../api/api.jsx'

const PRINT_QUEUE_PAGE_SIZE = 25

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
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false)

  const sortNewestFirst = (items) =>
    [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const fetchCurrentQueue = async (page = queuePage) => {
    const response = await getUnprintedFormAPdfQueue({
      page,
      limit: PRINT_QUEUE_PAGE_SIZE,
      includePagination: true,
    })
    setPdfQueue(sortNewestFirst(response.items))
    setQueuePagination(response.pagination)
    setQueuePage(response.pagination?.page || page)
  }

  const fetchPrintHistory = async (page = historyPage) => {
    const response = await getPrintedFormAPdfQueue({
      page,
      limit: PRINT_QUEUE_PAGE_SIZE,
      includePagination: true,
    })
    setPrintedQueue(sortNewestFirst(response.items))
    setHistoryPagination(response.pagination)
    setHistoryPage(response.pagination?.page || page)
    setHasLoadedHistory(true)
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
        setLoading(false)
      } catch (err) {
        console.error('Initial fetch error:', err)
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
    } finally {
      setRefreshing(false)
    }
  }

  const handleShowHistory = async () => {
    setView('history')
    if (hasLoadedHistory) return

    setRefreshing(true)
    try {
      await fetchPrintHistory()
    } catch (err) {
      console.error('Failed to fetch print history:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const handlePrint = async (entry) => {
    try {
      await generateFormAPdf(entry.patientId)
      await markFormAAsPrinted(entry._id)
      setHasLoadedHistory(false)
      await fetchCurrentQueue()
    } catch (error) {
      console.error('Failed to generate Form A PDF:', error)
      alert('Unable to generate Form A PDF because backend station eligibility is unavailable.')
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
    await deleteFormAFromQueue(entry._id)
    await fetchCurrentQueue()
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

      <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
        <Button
          variant={view === 'queue' ? 'contained' : 'outlined'}
          onClick={() => setView('queue')}
        >
          Show Current Queue
        </Button>
        <Button variant={view === 'history' ? 'contained' : 'outlined'} onClick={handleShowHistory}>
          Show Print History
        </Button>
        <Button variant='outlined' onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Stack>

      {loading || refreshing ? (
        <CircularProgress />
      ) : view === 'history' ? (
        printedQueue.length === 0 ? (
          <Typography>No printed records found.</Typography>
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
