import React, { Fragment } from 'react'
import { useFormikContext } from 'formik'

export default function PopupText({ qnNo, triggerValue, children }) {
  const { values } = useFormikContext()
  const qnValue = values[qnNo]

  if (Array.isArray(triggerValue)) {
    if (triggerValue.includes(qnValue)) return <Fragment>{children}</Fragment>
  } else {
    if (qnValue === triggerValue) return <Fragment>{children}</Fragment>
  }

  return null
}
