import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import SimpleSchema from 'simpl-schema'

import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'

import { AutoForm } from 'uniforms'
import {
  SubmitField,
  ErrorsField,
  SelectField,
  RadioField,
  LongTextField,
  TextField,
  BoolField,
  DateField,
} from 'uniforms-mui'
import CircularProgress from '@mui/material/CircularProgress'
import { submitForm, submitRegClinics } from '../api/api.js'
import { FormContext } from '../api/utils.js'
import { getClinicSlotsCollection, getSavedData } from '../services/mongoDB'
import './fieldPadding.css'
import './forms.css'
import { useField } from 'uniforms'
import PopupText from 'src/utils/popupText.js'

const schema = SimpleSchema({
  BONE2: {
    type: String,
    allowedValues: ['Yes', 'No'],
    optional: false,
  },
})
