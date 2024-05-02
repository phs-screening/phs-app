import React from 'react'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <Link to='/form2'>
        <Button disableElevation>Pre-Registration Form</Button>
      </Link>
    </div>
  )
}

export default HomePage
