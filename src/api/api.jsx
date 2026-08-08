export {
  calculateSppbScore,
  formatBmi,
  formatGeriVision,
  formatWceStation,
  parseGeriVision,
  parseWceStation,
  regexPasswordPattern,
  submitForm,
} from './formHelpers'

export { generateDoctorPdf } from '../reports/doctorPdf'
export { generateFormAPdf } from '../reports/formAPdf'
export {
  addBmi,
  addBloodPressure,
  addFollowUp,
  addMemos,
  addOtherScreeningModularities,
  addRecommendation,
  calculateY,
  followUpWith,
  generate_pdf,
  kNewlines,
  patient,
} from '../reports/patientReportPdf'
export {
  bloodPressureSection,
  bmiSection,
  followUpSection,
  generate_pdf_updated,
  memoSection,
  otherScreeningModularitiesSection,
  recommendationSection,
  temperatureSection,
} from '../reports/patientReportPdfUpdated'
