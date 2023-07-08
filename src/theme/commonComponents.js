import Divider from '@material-ui/core/Divider'
import React from 'react'

const size = 18

export function title(text) {
  return (
    <div>
      <Divider />
      <h2 style={{ whiteSpace: 'pre-wrap' }}>{text}</h2>
    </div>
  )
}

export function bold(text) {
  return <h2>{text}</h2>
}

export function divider() {
  return <div></div>
}

export function underlined(text) {
  return (
    <p style={{ textDecorationLine: 'underline', fontSize: size, whiteSpace: 'pre-wrap' }}>
      {text}
      <br />
    </p>
  )
}

export function underlinedWithBreak(text) {
  return <p style={{ textDecorationLine: 'underline', fontSize: size }}>{text}</p>
}

export function blueText(text) {
  if (Array.isArray(text)) {
    return text.map((x, i) => (
      <div key={i}>
        <p style={{ color: 'blue', margin: 2, whiteSpace: 'pre-wrap' }}>{x}</p>
      </div>
    ))
  } else {
    return (
      <div style={{ margin: 2 }}>
        <p style={{ color: 'blue', whiteSpace: 'pre-wrap' }}>{text}</p>
      </div>
    )
  }
}

export function redText(text) {
  if (Array.isArray(text)) {
    return text.map((x, i) => (
      <div key={i}>
        <p style={{ color: 'red', margin: 2, whiteSpace: 'pre-wrap' }}>{x}</p>
      </div>
    ))
  } else {
    return (
      <div style={{ margin: 2 }}>
        <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{text}</p>
      </div>
    )
  }
}

export function blueRedText(blueText, redText) {
  return (
    <div>
      <div style={{ margin: 2 }}>
        <p style={{ color: 'blue', whiteSpace: 'pre-wrap' }}>{blueText}</p>
      </div>
      <div style={{ margin: 2 }}>
        <p style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{redText}</p>
      </div>
    </div>
  )
}
