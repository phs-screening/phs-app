import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { useForm, Controller } from 'react-hook-form'

import { Checkbox, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import './Login.css'

const defaultValues = {
  TextField: '',
  Select: '',
  Checkbox: false,
  switch: false,
  RadioGroup: '',
}

function Form2() {
  const { handleSubmit, register, reset, control } = useForm({ defaultValues })
  const [data, setData] = useState(null)

  return (
    <div>
      <h1>Pre-Registration</h1>
      <form onSubmit={handleSubmit((data) => setData(data))}>
        <div>
          <section>
            <label>Gender</label>
            <Controller
              as={
                <RadioGroup aria-label='gender'>
                  <FormControlLabel value='female' control={<Radio />} label='Female' />
                  <FormControlLabel value='male' control={<Radio />} label='Male' />
                </RadioGroup>
              }
              name='RadioGroup'
              control={control}
            />
          </section>

          <section>
            <label>
              Initials (Surname must be spelt out. E.g. John Tan Soo Keng = Tan S.K.J. ; Alan Simon
              Lee = A.S. Lee)
            </label>
            <input name='Initials' className='input' ref={register} />
          </section>

          <section>
            <label>Last 4 digits of NRIC (e.g. 987A)</label>
            <input name='Nric' className='input' ref={register} />
          </section>

          <section>
            <label>Going for Phlebotomy?</label>
            <Controller as={Checkbox} name='Checkbox' type='checkbox' control={control} />
          </section>
          <input type='submit' />
        </div>
      </form>
    </div>
  )
}

export default Form2
