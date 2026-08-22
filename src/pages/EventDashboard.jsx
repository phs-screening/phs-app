import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { RefreshCw } from 'react-feather'
import { getEventDashboardSummary, getIncompletePatients } from '../api/eventDashboardApi'
import { getPrintedFormAPdfQueue } from '../services/printQueues'

const LIMIT = 25

const MetricCard = ({ label, value }) => (
  <Card>
    <CardContent>
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
      <Typography variant='h4' sx={{ mt: 1, fontWeight: 700 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
)

const CountList = ({ compact = false, emptyText, items, nameKey = 'name' }) => (
  <Box
    sx={{
      display: compact ? 'grid' : 'block',
      gridTemplateColumns: compact ? { xs: '1fr', sm: '1fr 1fr' } : undefined,
      gap: compact ? 1 : undefined,
      maxHeight: compact ? 280 : undefined,
      overflow: compact ? 'auto' : undefined,
      pr: compact ? 0.5 : undefined,
    }}
  >
    {items.length > 0 ? (
      items.map((item) => (
        <Box
          key={item[nameKey]}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            py: 1,
            px: compact ? 1 : 0,
            borderRadius: compact ? 1 : 0,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: compact ? 'background.default' : 'transparent',
          }}
        >
          <Typography variant='body2' sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item[nameKey]}
          </Typography>
          <Typography variant='body2' sx={{ fontWeight: 700 }}>
            {item.count}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant='body2' color='text.secondary'>
        {emptyText}
      </Typography>
    )}
  </Box>
)

const formatCurrentQueue = (currentQueue) => {
  if (!currentQueue) return 'Not in queue'
  return `${currentQueue.stationName} #${currentQueue.position}`
}

const EventDashboard = () => {
  const [summary, setSummary] = useState(null)
  const [patients, setPatients] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 0, total: 0 })
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadDashboard = async ({
    nextPage = page,
    nextQuery = activeQuery,
    refreshMetrics = true,
  } = {}) => {
    setLoading(true)
    setError('')

    try {
      const patientsRequest = getIncompletePatients({
        q: nextQuery,
        page: nextPage,
        limit: LIMIT,
      })

      if (refreshMetrics) {
        const [summaryResponse, patientsResponse, printedFormAResponse] = await Promise.all([
          getEventDashboardSummary(),
          patientsRequest,
          getPrintedFormAPdfQueue({ page: 1, limit: 1, includePagination: true }),
        ])
        const completedPatients = printedFormAResponse.pagination?.total || 0
        const registeredPatients = summaryResponse.data?.registeredPatients || 0

        setSummary({
          ...summaryResponse.data,
          completedPatients,
          screeningPatients: Math.max(registeredPatients - completedPatients, 0),
        })
        setPatients(patientsResponse.data || [])
        setPagination(
          patientsResponse.pagination || { page: nextPage, totalPages: 0, total: 0 },
        )
      } else {
        const patientsResponse = await patientsRequest

        setPatients(patientsResponse.data || [])
        setPagination(
          patientsResponse.pagination || { page: nextPage, totalPages: 0, total: 0 },
        )
      }
    } catch (e) {
      setError(e.message || 'Unable to load event dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard({ nextPage: 1, nextQuery: '' })
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    const nextQuery = query.trim()
    setActiveQuery(nextQuery)
    setPage(1)
    loadDashboard({ nextPage: 1, nextQuery, refreshMetrics: false })
  }

  const handlePageChange = (event, nextPage) => {
    setPage(nextPage)
    loadDashboard({ nextPage, refreshMetrics: false })
  }

  const refreshedAt = summary?.refreshedAt
    ? new Date(summary.refreshedAt).toLocaleString()
    : 'Not refreshed yet'

  return (
    <>
      <Helmet>
        <title>Event Dashboard</title>
      </Helmet>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100%', py: 3 }}>
        <Container maxWidth='xl'>
          <Stack spacing={3}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant='h3' sx={{ fontWeight: 700 }}>
                  Event Dashboard
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Last refreshed: {refreshedAt}
                </Typography>
              </Box>
              <Button
                startIcon={<RefreshCw size={18} />}
                variant='contained'
                onClick={() => loadDashboard()}
                disabled={loading}
                sx={{ alignSelf: { xs: 'stretch', sm: 'center' }, textTransform: 'none' }}
              >
                Refresh
              </Button>
            </Box>

            {error && <Alert severity='error'>{error}</Alert>}

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <MetricCard
                  label='Registered Patients'
                  value={summary?.registeredPatients ?? '-'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MetricCard label='Still Screening' value={summary?.screeningPatients ?? '-'} />
              </Grid>
              <Grid item xs={12} md={4}>
                <MetricCard
                  label='Completed (Form A Printed)'
                  value={summary?.completedPatients ?? '-'}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' sx={{ mb: 2, fontWeight: 700 }}>
                      Station Queues
                    </Typography>
                    <CountList
                      compact
                      emptyText='No station queues found.'
                      items={summary?.stationQueues || []}
                      nameKey='stationName'
                    />
                    {summary?.bottleneckStation && (
                      <Alert severity='info' sx={{ mt: 2 }}>
                        Bottleneck: {summary.bottleneckStation.stationName} (
                        {summary.bottleneckStation.count})
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Card>
                  <CardContent>
                    <Typography variant='h5' sx={{ mb: 2, fontWeight: 700 }}>
                      Print Queues
                    </Typography>
                    <CountList
                      emptyText='No pending print jobs.'
                      items={summary?.printQueues || []}
                      nameKey='queueName'
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card>
              <CardContent>
                <Box
                  component='form'
                  onSubmit={handleSearch}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant='h5' sx={{ fontWeight: 700 }}>
                      Registered But Not Completed
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {pagination.total || 0} patients found
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, minWidth: { sm: 360 } }}>
                    <TextField
                      fullWidth
                      size='small'
                      label='Search name or ID'
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <Button type='submit' variant='contained' sx={{ textTransform: 'none' }}>
                      Search
                    </Button>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Table size='small'>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Age</TableCell>
                          <TableCell>Current Queue</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {patients.length > 0 ? (
                          patients.map((patient) => (
                            <TableRow key={patient.queueNo}>
                              <TableCell>{patient.queueNo}</TableCell>
                              <TableCell>{patient.initials || 'Unknown'}</TableCell>
                              <TableCell>{patient.age || '-'}</TableCell>
                              <TableCell>{formatCurrentQueue(patient.currentQueue)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{ py: 2, textAlign: 'center' }}
                              >
                                No incomplete patients found.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>

                    {pagination.totalPages > 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Pagination
                          count={pagination.totalPages}
                          page={page}
                          color='primary'
                          onChange={handlePageChange}
                        />
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default EventDashboard
