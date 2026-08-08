import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { FormContext } from '../../src/api/utils'

export function createDeferred() {
  let resolve
  let reject
  const promise = new Promise((promiseResolve, promiseReject) => {
    resolve = promiseResolve
    reject = promiseReject
  })

  return { promise, resolve, reject }
}

function LocationDisplay() {
  const location = useLocation()
  return <output aria-label='Current route'>{location.pathname}</output>
}

export function renderFormWithContext(
  form,
  { patientId = 7, context = {}, initialPath = '/station' } = {},
) {
  const contextValue = { patientId, ...context }

  return {
    contextValue,
    ...render(
      <MemoryRouter initialEntries={[initialPath]}>
        <FormContext.Provider value={contextValue}>
          {form}
          <LocationDisplay />
        </FormContext.Provider>
      </MemoryRouter>,
    ),
  }
}

export function currentRoute() {
  return screen.getByRole('status', { name: 'Current route' })
}
