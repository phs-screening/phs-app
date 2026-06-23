import * as Yup from 'yup'

export const validationSchema = Yup.object({
  registrationQ1: Yup.string()
    .oneOf(['Mr', 'Ms', 'Mrs', 'Dr', 'Mdm'], 'Invalid salutation')
    .required('Salutation is required'),

  registrationQ2: Yup.string().required('Initials are required'),

  registrationQ3: Yup.date()
    .typeError('Birthday is required')
    .max(new Date(), 'Birthday cannot be in the future')
    .required('Birthday is required'),

  registrationQ4: Yup.number()
    .positive('Age must be positive')
    .integer('Age must be a whole number')
    .optional(),

  registrationQ5: Yup.string()
    .oneOf(['Male', 'Female'], 'Invalid gender')
    .required('Gender is required'),

  registrationQ6: Yup.string()
    .oneOf(
      ['Chinese 华裔', 'Malay 巫裔', 'Indian 印裔', 'Eurasian 欧亚裔', 'Others 其他'],
      'Invalid race',
    )
    .required('Race is required'),

  registrationShortAnsQ6: Yup.string().when('registrationQ6', {
    is: 'Others 其他',
    then: (schema) => schema.required('Please specify other race'),
    otherwise: (schema) => schema.notRequired(),
  }),

  registrationQ7: Yup.string()
    .oneOf(
      ['Singapore Citizen 新加坡公民', 'Singapore Permanent Resident (PR) \n新加坡永久居民'],
      'Invalid nationality',
    )
    .required('Nationality is required'),

  // registrationQ8: Yup.string()
  //   .oneOf(
  //     ['Single 单身', 'Married 已婚', 'Widowed 已寡', 'Separated 已分居', 'Divorced 已离婚'],
  //     'Invalid marital status',
  //   )
  //   .required('Marital status is required'),

  // registrationQ9: Yup.string().required('Occupation is required'),

  registrationQ11: Yup.string()
    .oneOf(['Yes', 'No'], 'Invalid HealthierSG status')
    .required('HealthierSG status is required'),

  registrationQ12: Yup.string()
    .oneOf(['CHAS Orange', 'CHAS Green', 'CHAS Blue', 'No CHAS'], 'Invalid CHAS status')
    .required('CHAS status is required'),

  registrationQ13: Yup.string()
    .oneOf(
      ['Pioneer generation card holder', 'Merdeka generation card holder', 'None'],
      'Invalid pioneer generation status',
    )
    .required('Pioneer generation status is required'),

  registrationQ14: Yup.string()
    .oneOf(['English', 'Mandarin', 'Malay', 'Tamil'], 'Invalid language preference')
    .required('Language preference is required'),

  registrationQ17: Yup.boolean()
    .oneOf([true], 'You must agree to the PDPA terms')
    .required('PDPA agreement is required'),

  registrationQ18: Yup.string()
    .oneOf(['Yes', 'No'], 'Please indicate if you have attended any health screenings before')
    .required('Health screening history is required'),

  registrationQ19: Yup.string()
    .oneOf(['Yes', 'No'], 'Please indicate if you have pre-registered for the Mammobus station')
    .required('Indication of mammobus pre-registration status is required'),

  registrationQ20: Yup.string()
    .oneOf(['Yes', 'No'], 'Invalid LTFU consent')
    .required('LTFU consent is required'),

  // registrationQ21: Yup.string().required(
  //   'Please indicate if the patient can speak either English or Chinese',
  // ),
})
