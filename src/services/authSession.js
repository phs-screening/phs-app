import { getCurrentProfile } from '../api/profilesApi'
import { clearPersistedPatient } from '../utils/patientPersistence'

const clearAuthSession = ({ deferPatientNotification = false } = {}) => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('profile')
  clearPersistedPatient({ deferNotification: deferPatientNotification })
}

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== 'string') return null

  const parts = token.split('.')
  if (parts.length < 2) return null

  const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const paddedPayload = base64Payload + '='.repeat((4 - (base64Payload.length % 4)) % 4)

  try {
    const decoded = decodeURIComponent(
      atob(paddedPayload)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    )

    return JSON.parse(decoded)
  } catch {
    return null
  }
}

const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return false

  return Date.now() >= payload.exp * 1000
}

export const getName = (profile) => {
  if (!profile) return ''
  return profile.name === undefined ? profile.email : profile.name
}

export const isLoggedin = () => {
  const token = localStorage.getItem('authToken')

  if (!token || isTokenExpired(token)) {
    clearAuthSession({ deferPatientNotification: true })
    return false
  }

  return true
}

export const logOut = async () => {
  clearAuthSession()
}

export const getProfile = async () => {
  if (!isLoggedin()) return null

  try {
    const data = await getCurrentProfile()
    return data.user
  } catch {
    return null
  }
}

export const isAdmin = async () => {
  const profile = await getProfile()
  return Boolean(profile?.is_admin)
}
