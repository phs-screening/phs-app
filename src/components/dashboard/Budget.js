import React from 'react'
import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import MoneyIcon from '@mui/icons-material/Money'
import { red } from '@mui/material/colors'

const Budget = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color='textSecondary' gutterBottom variant='h6'>
            BUDGET
          </Typography>
          <Typography color='textPrimary' variant='h3'>
            $24,000
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: red[600],
              height: 56,
              width: 56,
            }}
          >
            <MoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ArrowDownwardIcon sx={{ color: red[900] }} />
        <Typography
          sx={{
            color: red[900],
            mr: 1,
          }}
          variant='body2'
        >
          12%
        </Typography>
        <Typography color='textSecondary' variant='caption'>
          Since last month
        </Typography>
      </Box>
    </CardContent>
  </Card>
)

export default Budget
