import { getSavedData, getSavedPatientData, updateStationCounts } from './mongoDB'
import { getEligibilityRows } from '../pages/Eligibility'
import allForms from '../forms/forms.json'

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

    for (const [stationKey, formKeys] of Object.entries(stationFormMap)) {
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
  }