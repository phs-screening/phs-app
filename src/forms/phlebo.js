import React, { Component, Fragment } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoForm } from 'uniforms';
import { BoolField } from 'uniforms-material';


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