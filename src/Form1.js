import React from "react";
import { Form } from 'react-hook-form-generator';

const schema={
  select: {
    type: 'select',
    label: 'Salutation',
    options: [
      {
        value: 'Mr',
      },
      {
        value: 'Ms',
      },
      {
        value: 'Mrs',
      },
      {
        value: "Dr",
      },
    ],
  },
  text: {
    type: 'text',
    label: 'Name',
    placeholder: 'Name',
    isRequired: true,
  },
  about: {
    type: 'textArea',
    label: 'About',
    placeholder: 'Write something about yourself',
  },
  number: {
    type: 'number',
    label: 'Age',
    placeholder: 'Age',
  },
  toggle: {
    type: 'switch',
    label: 'Some Toggle',
  },
  days: {
    type: 'checkbox',
    label: 'Days of the Week',
    checkboxes: [
      {
        name: 'Monday',
      },
      {
        name: 'Tuesday',
      },
      {
        name: 'Wednesday',
      },
      {
        name: 'Thursday',
      },
      {
        name: 'Friday',
      },
    ],
  },
  address: {
    type: 'object',
    label: 'Address',
    properties: {
      city: {
        type: 'text',
        placeholder: 'City',
      },
      country: {
        type: 'text',
        placeholder: 'Country',
      },
    },
  },
}

const Form1 = () => {
  const handleSubmit = values => {
    // Do something
    console.log(values);
  };

  return <Form title="Registration" schema={schema} handleSubmit={handleSubmit} />;
};

export default Form1;