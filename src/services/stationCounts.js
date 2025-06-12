import { getSavedData, getSavedPatientData, updateStationCounts } from './mongoDB'
import allForms from '../forms/forms.json'

export const getEligibilityRows = (forms = {}) => {
  const {
    reg = {},
    pmhx = {},
    hxsocial = {},
    hxfamily = {},
    triage = {},
    hcsr = {},
    hxoral = {},
    phq = {},
  } = forms
  
  const createData = (name, isEligible) => ({
    name,
    eligibility: isEligible ? 'YES' : 'NO'
  })
  
  const isPhlebotomyEligible = reg?.registrationQ15 === 'Yes'
  const isVaccinationEligible = reg?.registrationQ4 >= 65 && reg?.registrationQ7 === 'Singapore Citizen 新加坡公民'
  const isHealthierSGEligible = reg?.registrationQ11 !== 'Yes'
  const isLungFunctionEligible = hxsocial?.SOCIAL10 === 'Yes, (please specify how many pack-years)' || hxsocial?.SOCIAL11 === 'Yes, (please specify)'
  const isFITEligible = reg?.registrationQ4 >= 50 && pmhx?.PMHX10 === 'No' && pmhx?.PMHX11 === 'No'
  const isWomenCancerEducationEligible = reg?.registrationQ5 === 'Female'
  const isOsteoporosisEligible =
    (reg?.registrationQ5 === 'Female' && reg?.registrationQ4 >= 45) ||
    (reg?.registrationQ5 === 'Male' && reg?.registrationQ4 >= 55)
  
  const isHaveConditions = pmhx.PMHX7 &&
    (pmhx?.PMHX7.includes('Kidney Disease') ||
    pmhx?.PMHX7.includes('Diabetes') ||
    pmhx?.PMHX7.includes('Hypertension'))
  
  const isHaveFamilyCondition = hxfamily?.FAMILY3 && hxfamily?.FAMILY3.length > 0
  const isExceedTriage = triage?.triageQ12 >= 27.5
  const isNKFEligible = (isHaveConditions || isHaveFamilyCondition || isExceedTriage) &&
    pmhx?.PMHX9 === 'No' && reg?.registrationQ4 <= 80
  
  const isMentalHealthEligible = (phq?.PHQ10 >= 10 && reg?.registrationQ4 < 60) || phq?.PHQ11 === 'Yes'
  const isAudiometryEligible = reg?.registrationQ4 >= 60 && pmhx?.PMHX13 === 'No'
  const isGeriatricScreeningEligible = reg?.registrationQ4 >= 60
  
  const isDoctorStationEligible = triage?.triageQ9 === 'Yes' ||
    hcsr?.hxHcsrQ3 === 'Yes' ||
    hcsr?.hxHcsrQ8 === 'Yes' ||
    pmhx?.PMHX12 === 'Yes' ||
    phq?.PHQ10 >= 10 ||
    phq?.PHQ9 !== '0 - Not at all'
  
  const isDietitianEligible = hxsocial?.SOCIAL15 === 'Yes'
  const isSocialServicesEligible = hxsocial?.SOCIAL6 === 'Yes' ||
    hxsocial?.SOCIAL7 === 'Yes, (please specify)' ||
    (hxsocial?.SOCIAL8 === 'Yes' && hxsocial?.SOCIAL9 === 'No')
  
  const isDentalEligible = hxoral?.ORAL5 === 'Yes'
  
  return [
    createData('Healthier SG Booth', isHealthierSGEligible),
    createData('Phlebotomy', isPhlebotomyEligible),
    createData('Faecal Immunochemical Testing (FIT)', isFITEligible),
    createData('Lung Function Testing', isLungFunctionEligible),
    createData("Women's Cancer Education", isWomenCancerEducationEligible),
    createData('Osteoporosis', isOsteoporosisEligible),
    createData('Kidney Screening', isNKFEligible),
    createData('Mental Health', isMentalHealthEligible),
    createData('Vaccination', isVaccinationEligible),
    createData('Geriatric Screening', isGeriatricScreeningEligible),
    createData('Audiometry', isAudiometryEligible),
    { name: 'HPV On-Site Testing', eligibility: 'Determined at another station' },
    createData("Doctor's Station", isDoctorStationEligible),
    createData("Dietitian's Consult", isDietitianEligible),
    createData('Oral Health', isDentalEligible),
    createData('Social Services', isSocialServicesEligible),
  ]
}


// groups station keys which are counted as one logical station
export function computeVisitedStationsCount(record) {
  const stationFormMap = {
    hsg: ['hsgForm'],
    phlebo: ['phlebotomyForm'],
    fit: ['fitForm'],
    lungfn: ['lungFnForm'],
    wce: ['wceForm', 'gynaeForm'],
    osteo: ['osteoForm'],
    nkf: ['nkfForm'],
    mentalhealth: ['mentalHealthForm'],
    vax: ['vaccineForm'],
    geriscreening: ['geriAmtForm', 'geriGraceForm', 'geriWhForm', 'geriInterForm', 
      'geriPhysicalActivityLevelForm', 'geriOtQuestionnaireForm', 'geriSppbForm', 'geriPtConsultForm', 'geriOtConsultForm',
      'geriVisionForm'],
    geriaudio: ['geriAudiometryForm'],
    doctorsconsult: ['doctorConsultForm'],
    dietitiansconsult: ['dietitiansConsultForm'],
    oralhealth: ['oralHealthForm'],
    socialservice: ['socialServiceForm'],
    hpv: ['hpvForm'],
  }

    let visitedCount = 0

    for (const [stationKeys, formKeys] of Object.entries(stationFormMap)) {
      const allFilled = formKeys.every((formKey) => {
      const form = record[formKey]
      return form != undefined
    })

    if (allFilled) {
      visitedCount++
      }
  }
  return visitedCount
}

// compute and update visited and eligible station counts
export const updateAllStationCounts = async (patientId) => {
  // fetch patient record (used for visited station logic)
  const patient = await getSavedPatientData(patientId, 'patients')
  const visitedStationsCount = computeVisitedStationsCount(patient)
  
  // fetch all relevant forms for eligibility
  const [
    pmhx, hxsocial, reg, hxfamily, triage, hcsr, hxoral, wce, phq,
  ] = await Promise.all([
    getSavedData(patientId, allForms.hxNssForm),
    getSavedData(patientId, allForms.hxSocialForm),
    getSavedData(patientId, allForms.registrationForm),
    getSavedData(patientId, allForms.hxFamilyForm),
    getSavedData(patientId, allForms.triageForm),
    getSavedData(patientId, allForms.hxHcsrForm),
    getSavedData(patientId, allForms.hxOralForm),
    getSavedData(patientId, allForms.wceForm),
    getSavedData(patientId, allForms.geriPhqForm),
  ])
  
  const formData = {
    reg: reg || {},
    pmhx: pmhx || {},
    hxsocial: hxsocial || {},
    hxfamily: hxfamily || {},
    triage: triage || {},
    hcsr: hcsr || {},
    hxoral: hxoral || {},
    wce: wce || {},
    phq: phq || {},
  }
  
  const rows = getEligibilityRows(formData)
  const eligibleStationsCount = rows.filter((r) => r.eligibility === 'YES').length
  
  await updateStationCounts(patientId, visitedStationsCount, eligibleStationsCount)
  console.log('visited:', visitedStationsCount, 'eligible:', eligibleStationsCount)
}