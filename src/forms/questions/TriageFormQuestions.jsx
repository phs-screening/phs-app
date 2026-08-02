import React from 'react'

export const triageFormQuestionText = {
  triageQ1: '1st Reading Systolic (mmHg)',
  triageQ2: '1st Reading Diastolic (mmHg)',
  triageQHR1: '1st Reading Heart Rate (bpm)',
  triageQ3: '2nd Reading Systolic (mmHg)',
  triageQ4: '2nd Reading Diastolic (mmHg)',
  triageQHR2: '2nd Reading Heart Rate (bpm)',
  triageQ5: (
    <>
      3rd Reading Systolic (Only if 1st and 2nd systolic reading differ by <b>&gt;5mmHg</b>)
    </>
  ),
  triageQ6: (
    <>
      3rd Reading Diastolic (ONLY if 1st and 2nd diastolic reading differ by <b>&gt;5mmHg</b>)
    </>
  ),
  triageQHR3: (
    <>
      3rd Reading Heart Rate (ONLY if 1st and 2nd heart rate reading differ by <b>&gt;5bpm</b>)
    </>
  ),
  triageQ9:
    "Q9. Does the patient's blood pressure require closer scrutiny by doctors later? (e.g. Systolic above 180/120)",
  triageQ10: 'Height (in cm)',
  triageQ11: 'Weight (in kg)',
  triageQ13: 'Waist Circumference (in cm)',
  triageQ15: 'Neck Circumference (in cm)',
  triageQ14: 'Temperature (in Celsius)',
  triageQ16: 'SpO2 (%)',
}
