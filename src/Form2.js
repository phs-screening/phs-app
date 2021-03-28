import React from 'react';
import { Form } from 'react-hook-form-generator';

const schema={
  gender: {
    type: 'select',
    label: 'Gender',
    options: [
      {
        value: 'Male',
      },
      {
        value: 'Female',
      },
      {
        value: 'Rather not say',
      },
    ],
  },
  initials: {
    type: 'text',
    label: 'Initials',
    placeholder: 'Surname must be spelt out. E.g. John Tan Soo Keng = Tan S.K.J. ; Alan Simon Lee = A.S. Lee',
    isRequired: true,
  },
  nric: {
    type: 'text',
    label: 'Last 4 digits of NRIC',
    placeholder: 'e.g. 987A',
  },
  phlebotomy: {
    type: 'switch',
    label: 'Going for Phlebotomy?',
    defaultChecked: true,
  },
}

const Form2 = () => {
  const handleSubmit = values => {
    // Do something
    console.log(values);
  };

  return <Form title="Station: Registration" schema={schema} handleSubmit={handleSubmit} />;
};

export default Form2;