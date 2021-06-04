import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import AutoForm from 'uniforms-material/AutoForm';
import AutoField from 'uniforms-material/AutoField';
import TextField from 'uniforms-material/TextField';
import SubmitField from 'uniforms-material/SubmitField';
import SelectField from 'uniforms-material/SelectField';
import HiddenField from 'uniforms-material/HiddenField';
import NumField from 'uniforms-material/NumField';
import ListField from 'uniforms-material/ListField';
import DateField from 'uniforms-material/DateField';
import RadioField from 'uniforms-material/RadioField';
import BoolField from 'uniforms-material/BoolField';
import LongTextField from 'uniforms-material/LongTextField';

import BaseField from 'uniforms/BaseField';
import nothing from 'uniforms/nothing';
import {Children} from 'react';
import { Radio } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';


export const schema = new SimpleSchema({
	phlebotomyQ1: {
		type: Boolean, label: "Yes", optional: true
		}, phlebotomyQ2: {
		type: Boolean, label: "Yes", optional: true
		}
	}
)

export const layout = (
    <Fragment>
		Blood sample collected?
		<BoolField name="phlebotomyQ1" />
		Circled 'Completed' under Phlebotomy on Form A?
		<BoolField name="phlebotomyQ2" />
		
	</Fragment>
  )