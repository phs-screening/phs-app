import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';


const RegisterPatient = props => {
  const [values, setValues] = useState({
    queueNumber: 1
  });

  const handleChange = (event) => {
    const value = event.target.value;
    if (value >= 0 || value === "") {
      setValues({
        [event.target.name]: event.target.value
      });
      console.log("updated value")
    } else {
      event.target.value = 0; 
    }
  };

  const handleSubmit = () => {
    console.log(values.queueNumber)
    // TODO: make a post request using axios;
    // if response is successful, update state for curr id and redirect to dashboard timeline for specific id
    // if response is unsuccessful/id does not exist, show error style/popup.
  };

  return (
    <Card {...props}>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Button
          color="primary"
          size="large"
          type="submit"
          variant="contained"
          href="/app/prereg"
          sx={{ marginTop: 1, marginBottom: 2 }}
          >
          Register
          </Button>
          <Typography></Typography>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            OR
          </Typography>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            Enter queue number below
          </Typography>
          <TextField
            id="queue-number"
            name="queueNumber"
            sx={{ marginTop: 2, marginBottom: 1 }}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon
                    fontSize="small"
                    color="action"
                  >
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              )
            }}
            placeholder="Queue number"
            size="small"
            variant="outlined"
            onChange={handleChange}
          />
          <Button
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            onClick={handleSubmit}
          >
          Go
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RegisterPatient;
