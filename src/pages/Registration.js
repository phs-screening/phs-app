import { Helmet } from 'react-helmet'
import { Box, Container, Grid } from '@material-ui/core'
import RegisterPatient from 'src/components/RegisterPatient'

const Registration = () => (
  <>
    <Helmet>
      <title>PHS Register</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
      }}
    >
      <Container maxWidth='lg'>
        <Grid container spacing={3}>
          <Grid item lg={2} md={2} xs={0}></Grid>
          <Grid item lg={8} md={8} xs={12}>
            <RegisterPatient />
          </Grid>
          <Grid item lg={2} md={2} xs={0}></Grid>
        </Grid>
      </Container>
    </Box>
  </>
)

export default Registration
