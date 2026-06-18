import React, { useEffect, useState } from 'react'
import { Alert, Backdrop, CircularProgress, Snackbar } from '@mui/material'
import { useLocation } from 'react-router-dom'

export const FORM_SUBMIT_STATUS_EVENT = 'phs-form-submit-status'
export const FORM_SUBMIT_STATUS_RELEASE_EVENT = 'phs-form-submit-status-release'
export const FORM_SUBMIT_SUCCESS_REDIRECT_DELAY_MS = 900
export const FORM_SUBMIT_SUCCESS_FALLBACK_HIDE_MS = 2500
export const FORM_SUBMIT_ERROR_HIDE_MS = 2000
export const FORM_SUBMIT_STATUS_TOP_OFFSET = 72

export function showFormSubmitSuccess({
  message = 'Successfully submitted form. Redirecting...',
  redirectDelayMs = FORM_SUBMIT_SUCCESS_REDIRECT_DELAY_MS,
} = {}) {
  window.dispatchEvent(
    new CustomEvent(FORM_SUBMIT_STATUS_EVENT, {
      detail: {
        autoHideDuration: FORM_SUBMIT_SUCCESS_FALLBACK_HIDE_MS,
        blocking: true,
        message,
        redirecting: true,
        severity: 'success',
      },
    }),
  )

  return new Promise((resolve) => {
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(FORM_SUBMIT_STATUS_RELEASE_EVENT))
      resolve()
    }, redirectDelayMs)
  })
}

export function showFormSubmitError(message = 'An error occurred during submission.') {
  window.dispatchEvent(
    new CustomEvent(FORM_SUBMIT_STATUS_EVENT, {
      detail: {
        autoHideDuration: FORM_SUBMIT_ERROR_HIDE_MS,
        blocking: false,
        message,
        redirecting: false,
        severity: 'error',
      },
    }),
  )
}

const FormSubmitStatusHost = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const handleStatus = (event) => {
      setStatus({
        autoHideDuration: null,
        blocking: false,
        message: '',
        redirecting: false,
        severity: 'info',
        ...event.detail,
      })
      setOpen(true)
    }

    const handleRelease = () => {
      setStatus((currentStatus) =>
        currentStatus ? { ...currentStatus, blocking: false } : currentStatus,
      )
      setOpen(false)
    }

    window.addEventListener(FORM_SUBMIT_STATUS_EVENT, handleStatus)
    window.addEventListener(FORM_SUBMIT_STATUS_RELEASE_EVENT, handleRelease)

    return () => {
      window.removeEventListener(FORM_SUBMIT_STATUS_EVENT, handleStatus)
      window.removeEventListener(FORM_SUBMIT_STATUS_RELEASE_EVENT, handleRelease)
    }
  }, [])

  useEffect(() => {
    if (status?.redirecting) {
      setOpen(false)
    }
  }, [location.key])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  const handleExited = () => {
    setStatus(null)
  }

  return (
    <>
      <Backdrop
        open={open && Boolean(status?.blocking)}
        sx={{
          bgcolor: 'transparent',
          zIndex: (theme) => theme.zIndex.snackbar - 1,
        }}
      />
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        autoHideDuration={status?.autoHideDuration}
        onClose={handleClose}
        open={open}
        sx={{ top: { xs: FORM_SUBMIT_STATUS_TOP_OFFSET, sm: FORM_SUBMIT_STATUS_TOP_OFFSET } }}
        TransitionProps={{ onExited: handleExited }}
      >
        <Alert
          icon={status?.redirecting ? <CircularProgress color='inherit' size={18} /> : undefined}
          onClose={status?.redirecting ? undefined : handleClose}
          severity={status?.severity || 'info'}
          sx={{ alignItems: 'center', width: '100%' }}
          variant='filled'
        >
          {status?.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default FormSubmitStatusHost
