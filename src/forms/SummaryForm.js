import React, {Fragment, useContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { calculateBMI, formatGeriVision, formatWceStation, geriVisionForm, preRegister, submitForm, generate_pdf} from '../api/api.js';
import { FormContext } from '../api/utils.js';
import { getSavedData, getSavedPatientData } from "../services/mongoDB";
import allForms from "./forms.json";
import { bold, underlined, blueText, redText, blueRedText} from 'src/theme/commonComponents.js';
import { Button } from '@material-ui/core';

const formName = "summaryForm"


const SummaryForm = (props) => {
  const {patientId, updatePatientId} = useContext(FormContext);
  const [loadingPrevData, isLoadingPrevData] = useState(true);
  const [saveData, setSaveData] = useState({});

  // All the forms 
  const [hcsr, setHcsr] = useState({})
  const [nss, setNss] = useState({})
  const [social, setSocial] = useState({})
  const [vision, setVision] = useState({})
  const [cancer, setCancer] = useState({})
  const [fit, setFit] = useState({})
  const [wce, setWce] = useState({})
  const [patients, setPatients]= useState({}) 
  const [phlebotomy, setPhlebotomy] = useState({}) 
  const [registration, setRegistration] = useState({})
  const [geriMmse, setGeriMmse] = useState({})
  const [geriVision, setGeriVision] = useState({})
  const [geriAudiometry, setGeriAudiometry] = useState({})
  const [geriPtConsult, setGeriPtConsult] = useState({})
  const [geriOtConsult, setGeriOtConsult] = useState({})
  const [geriEbasDep, setGeriEbasDep] = useState({})
  const [geriGeriAppt, setGeriGeriAppt] = useState({})
  const [geriAmt, setGeriAmt] = useState({})
  const [geriFunctionalScreening, setGeriFunctionalScreening] = useState({})
  const [socialService, setSocialService] = useState({})
  const [doctorSConsult, setDoctorSConsult] = useState({})
  const [dietitiansConsult, setDietiatiansConsult] = useState({})
  const [oralHealth, setOralHealth] = useState({})

  useEffect(async () => {
    const loadPastForms = async () => {
		const registrationData = getSavedData(patientId, allForms.registrationForm)
        const hcsrData = getSavedData(patientId, allForms.hxHcsrForm);
        const nssData = getSavedData(patientId, allForms.hxNssForm);
        const socialData = getSavedData(patientId, allForms.hxSocialForm);
        const cancerData = getSavedData(patientId, allForms.hxCancerForm);
		const visionData = getSavedData(patientId, allForms.geriVisionForm)
		const fitData = getSavedData(patientId, allForms.fitForm)
		const wceData = getSavedData(patientId, allForms.wceForm)
		const patientsData = getSavedPatientData(patientId, 'patients')
		const phlebotomyData = getSavedData(patientId, allForms.phlebotomyForm)
		const geriPtConsultData = getSavedData(patientId, allForms.geriPtConsultForm)
		const geriVisionData = getSavedData(patientId, allForms.geriVisionForm)
		const geriAudiometryData = getSavedData(patientId, allForms.geriAudiometryForm)
		const geriOtConsultData = getSavedData(patientId, allForms.geriOtConsultForm)
		const geriEbasDepData = getSavedData(patientId, allForms.geriEbasDepForm)
		const geriGeriApptData = getSavedData(patientId, allForms.geriGeriApptForm)
		const geriMmseData = getSavedData(patientId, allForms.geriMmseForm)
		const geriFunctionalScreeningData = getSavedData(patientId, allForms.geriFunctionalScreeningForm)
		const geriAmtData = getSavedData(patientId, allForms.geriAmtForm)
		const socialServiceData = getSavedData(patientId, allForms.socialServiceForm)
		const doctorConsultData = getSavedData(patientId, allForms.doctorConsultForm)
		const dietitiansConsultData = getSavedData(patientId, allForms.dietitiansConsultForm)
		const oralHealthData = getSavedData(patientId, allForms.oralHealthForm)

        Promise.all([hcsrData, nssData, socialData, cancerData, visionData, fitData, wceData,
          patientsData, geriPtConsultData, geriOtConsultData, socialServiceData, doctorConsultData, 
		  registrationData, phlebotomyData, geriEbasDepData, geriGeriApptData, geriAmtData, dietitiansConsultData, oralHealthData,
		  geriMmseData, geriVision, geriAudiometryData, geriFunctionalScreeningData])
            .then((result) => {
              setHcsr(result[0])
              setNss(result[1])
              setSocial(result[2])
              setCancer(result[3])
              setVision(result[4])
              setFit(result[5])
              setWce(result[6])
              setPatients(result[7])
              setGeriPtConsult(result[8])
              setGeriOtConsult(result[9])
              setSocialService(result[10])
              setDoctorSConsult(result[11])
			  setRegistration(result[12])
			  setPhlebotomy(result[13])
			  setGeriEbasDep(result[14])
			  setGeriGeriAppt(result[15])
			  setGeriAmt(result[16])
			  setDietiatiansConsult(result[17])
			  setOralHealth(result[18])
			  setGeriMmse(result[19])
			  setGeriVision(result[20])
			  setGeriAudiometry(result[21])
			  setGeriFunctionalScreening(result[22])
            })

        isLoadingPrevData(false);
    }
    loadPastForms();
  }, [])

    return (
      <Paper elevation={2} pt={3} m={3}>
		{loadingPrevData ? <CircularProgress/>
		:
		<Fragment m={2} pt={2}>
		<div>
			{bold("Form Summary")}
			{bold("Please make sure that the information is correct.")}

			<br></br>
			{bold("1. Personal Particulars")}
			{underlined("Salutation")}
			{registration ? blueText(registration.registrationQ1) : '-'}
			<br></br>
			{underlined("Initials")}
			{patients ? blueText(patients.initials) : '-'}
			<br></br>
			{underlined("Gender")}
			{patients ? blueText(patients.gender) : '-'}
			<br></br>

			<br></br>
			{bold("2. Phlebotomy")}
			{underlined("Eligible for phlebotomy:")}
			{registration ? registration.registrationQ12
							? blueText("Yes")
							: blueText("No") 
						: '-'}
			<br></br>
			{underlined("Completed phlebotomy:")}
			{phlebotomy ? phlebotomy.phlebotomyQ1
							? blueRedText("Yes", "Kindly remind him that PHS will follow-up with them via mailing the results directly"
												 + " to them or to their preferred GP clinics. These instructions are subjected to changes and hence, verify with the updated"
												 + " protocols.")
							: blueText("No") 
						: '-'}
			<br></br>
			
			<br></br>
			{bold("3. History Taking")}
			{underlined("Referrals")}
			{cancer ? blueText(cancer.hxCancerQ25) : '-'}
			<br></br>

			<br></br>
			{bold("4. Health Concerns")}
			{underlined("Participant's presenting complaints/concerns requires scrutiny by doctor: (if any)")}
			{hcsr.hxHcsrQ11 == "Yes"
				? blueRedText(hcsr.hxHcsrQ11, "Please check if participant has visited the Doctor's Consult Station.")
				: blueText(hcsr.hxHcsrQ11)}
			<br></br>
			{underlined("Participant's presenting complaints/concerns (if any)")}
			{hcsr ? blueText(hcsr.hxHcsrQ2) : '-'}
			<br></br>

			<br></br>
			{bold("5. Systems Review")}
			{underlined("Participant's presenting complaints/ concerns requires scrutiny by doctor:")} 
			{hcsr.hxHcsrQ12
				? blueRedText(hcsr.hxHcsrQ12, "Please check if participant has visited the Doctor's Consult Station.")
				: blueText(hcsr.hxHcsrQ12)}
			<br></br>
			{underlined("Participant's system review")}
			{hcsr ? blueText(hcsr.hxHcsrQ3) : '-'}
			<br></br>

			<br></br>
			{bold("6. Past Medical History")}
			{underlined("Participant's past medical history requires scrutiny by doctor:")}
			{nss.hxNssQ11 == "Yes"
				? blueRedText(nss.hxNssQ11, "Please check if participant has visited the Doctor's Consult Station.")
				: blueText(nss.hxNssQ11)}
			<br></br>
			{underlined("Summary of participants's past medical history")}
			{nss ? blueText(nss.hxNssQ12) : '-'}
			<br></br>

			<br></br>
			{bold("7. Family History")}
			{underlined("Participant's past medical history requires scrutiny by doctor:")}
			{cancer.hxCancerQ9 == "Yes"
				? blueRedText(cancer.hxCancerQ9, "Please check if participant has visited the Doctor's Consult Station.")
				: blueText(cancer.hxCancerQ9)}
			<br></br>
			{underlined("Summary of participant's past medical history:")}
			{cancer ? blueText(cancer.hxCancerQ10) : '-'}
			<br></br>

			<br></br>
			{bold("8. Blood Pressure")}
			{underlined("Average Blood Pressure (Systolic)")}
			{cancer ? (parseInt(cancer.hxCancerQ17) >= 130 ? redText(cancer.hxCancerQ17 + "\nBlood pressure is high, please see a GP if you have not been diagnosed with hypertension")
														   : blueText(cancer.hxCancerQ17)) 
					: '-'} 
			<br></br>
			{underlined("Average Blood Pressure (Diastolic)")}
			{cancer ? (parseInt(cancer.hxCancerQ18) >= 85 ? redText(cancer.hxCancerQ18 + "\nBlood pressure is high, please see a GP if you have not been diagnosed with hypertension") 
												          : blueText(cancer.hxCancerQ18)) 
					: '-'} 
			<br></br>

			<br></br>
			{bold("9. BMI")}
			{underlined("Height (in cm)")}
			{cancer ? blueText(cancer.hxCancerQ19) : '-'}
			<br></br>
			{underlined("Weight (in kg)")}
			{cancer ? blueText(cancer.hxCancerQ20) : '-'}
			<br></br>
			{underlined("Waist Circumference (in cm)")}
			{cancer ? Number(cancer.hxCancerQ24) >= 90 && patients.gender == "Male"
						? redText(cancer.hxCancerQ24 + "\nYour waist circumference is above the normal range. The normal range is less than 90 cm for males." )
						: Number(cancer.hxCancerQ24) >= 80 && patients.gender == "Female"
							? redText(cancer.hxCancerQ24 + "\nYour waist circumference is above the normal range. The normal range is less than 80 cm for females.")
							: blueText(cancer.hxCancerQ24)
					: '-'}
			<br></br>
			{underlined("Body Mass Index (BMI)")}
			{cancer ? calculateBMI(Number(cancer.hxCancerQ19), Number(cancer.hxCancerQ20)) : '-'}
			<br></br>

			<br></br>
			{bold("10. Incontinence")}
			{underlined("Do you have any problem passing urine or motion? Please specify if yes.")}
			{hcsr ? (hcsr.hxHcsrQ4 == "Yes, (Please specify):"
					? blueRedText(hcsr.hxHcsrQ4, "Check if participant is referred to Doctor's Consult AND Society for Continence Singapore (SFCS) booth at Exhibition."
												 + " If no, tick on PHS Passport and indicate.")
					: blueText(hcsr.hxHcsrQ4))
				  : "-"}
			{hcsr ? blueText(hcsr.hxHcsrQ5) : "-"}
			<br></br>

			<br></br>
			{bold("11. Vision")}
			{underlined("Do you have any vision problems? Please specify if yes")}
			{hcsr ? hcsr.hxHcsrQ6 == "Yes, (Please specify):"
					? blueRedText(hcsr.hxHcsrQ6, "If participant is below 60 years, please check if the participant is referred to Doctor's Consult. If participant"
												 + " is at least 60 years, please check if the participant is referred to Geriatrics"
												 + " for further screening/referral.")
					: blueText(hcsr.hxHcsrQ6)
				  : blueText(hcsr.hxHcsrQ6)}
			<br></br>
			{underlined("Please specify:")}
			{hcsr ? blueText(hcsr.hxHcsrQ7) : '-'}
			<br></br>

			<br></br>
			{bold("12. Hearing")}
			{underlined("Do you have any hearing problems? Please specify if yes.")}
			{hcsr ? hcsr.hxHcsrQ8 == "No" || typeof hcsr.hxHcsrQ8 == "undefined"
					? blueText(hcsr.hxHcsrQ8)
					: blueRedText(hcsr.hxHcsrQ6, "If participant is below 60 years, please check if the participant is referred to Doctor's Consult. If participant"
												 + " is at least 60 years, please check if the participant is referred to Geriatrics"
												 + " for further screening/referral.")
				: "-"}
			<br></br>
			{underlined("Please specify:")}
			{hcsr ? blueText(hcsr.hxHcsrQ9) : '-'}
			<br></br>

			<br></br>
			{bold("13. Social History")}
			{underlined("Does participant smoke?")}
			{nss ? nss.hxNssQ14 == "No"
					? blueText(nss.hxNssQ14)
					: blueRedText(nss.hxNssQ14, "Kindly advise participant to consider smoking cessation. If participant is interested, refer him/her to HPB's I Quit Programme")
				: '-'}
			<br></br>
			{underlined("Do you consume alcoholic drinks? (Note: Standard drink means a shot of hard liquor, a can or bottle of beer, or a glass of wine.)")}
			{nss ? blueText(nss.hxNssQ15) : '-'}
			<br></br>

			<br></br>
			{bold("14. FIT kits")}
			{underlined("Was the participant issued 2 FIT kits")}
			{fit ? fit.fitQ2 == "Yes"
					? blueRedText(fit.fitQ2, "Kindly remind the participant to adhere to the instructions regarding FIT kit application and sending. Teach the participant how to use the kit if"
											+ "he/she is unsure or has forgotten.")
					:  redText(fit.fitQ2)
				: "-"}
			<br></br>

			<br></br>
			{bold("15. WCE Station")}
			{underlined("Completed Breast Self Examination station?")}
			{formatWceStation(patients.gender, 2, wce.wceQ2)}
			<br></br>
			{underlined("Completed Cervical Education station?")}
			{formatWceStation(patients.gender, 3, wce.wceQ3)}
			<br></br>
			{underlined("Indicated interest for HPV Test under SCS?")}
			{formatWceStation(patients.gender, 4, wce.wceQ4)}
			<br></br>
			{underlined("Indicated interest for Mammogram under SCS?")}
			{formatWceStation(patients.gender, 5, wce.wceQ5)}
			<br></br>
			{underlined("Registered for Mammogram under NHGD?")}
			{formatWceStation(patients.gender, 6, wce.wceQ6)}
			<br></br>

			<br></br>
			{bold("16. Geriatrics")}
			<br></br>
			{bold("a. Geriatrics - AMT")}
			{underlined("Did participant fail AMT?")}
			{geriAmt ? blueText(geriAmt.geriAmtQ12) : "-"}
			<br></br>
			{underlined("Referred to G-RACE for MMSE on-site?")}
			{geriAmt ? blueText(geriAmt.geriAmtQ13ation) : "-"}
			<br></br>
			{bold("b. Geriatrics - MMSE")}
			{underlined("Need referral to G-RACE associated polyclinics/ partners?")}
			{geriMmse ? blueText(geriMmse.geriMMSEQ2) : "-"}
			<br></br>
			{underlined("Referral made to G-RACE associated polyclinics/ partners?")}
			{geriMmse ? geriMmse.geriMMSEQ3 == "Yes"
						? blueRedText(geriMmse.geriMMSEQ3, "Please advise the participant to follow through"
														   + "with G-RACE and affiliated polyclinics/ partners.")
						: blueText(geriMmse.geriMMSEQ3)
					  : '-'}
			<br></br>
			{underlined("Recommended polyclinic:")}
			{blueText(geriMmse.geriMMSEQ4)}
			<br></br>
			{bold("c. Geriatrics - EBAS")}
			{underlined("Referred to Social Service for failing EBAS?")}
			{geriEbasDep ? geriEbasDep.geriEbasDepQ10 == "Yes"
							? blueRedText(geriEbasDep.geriEbasDepQ10, "Please check if participant has visited the Social Service Station.")
							: blueText(geriEbasDep.geriEbasDepQ10) 
						  : "-"}
			<br></br>
			{underlined("Referred to Social Service for potential financial/ family difficulties?")}
			{geriEbasDep ? geriEbasDep.geriEbasDepQ11 == "Yes"
							? blueRedText(geriEbasDep.geriEbasDepQ11, "Please check if participant has visited the Social Service Station.")
							: blueText(geriEbasDep.geriEbasDepQ11) 
						 : "-"}
			<br></br>
			{underlined("Reasons for referral to Social Service:")}
			{geriEbasDep ? blueRedText(geriEbasDep.geriEbasDepQ12) : "-"}
			<br></br>
			{bold("d. Geriatrics - PT consult")}
			{underlined("Memo from PT:")}
			{geriPtConsult ? blueRedText(geriPtConsult.geriPtConsultQ1) : "-"}
			<br></br>
			{underlined("Was participant referred for Doctor's Consult?")}
			{geriPtConsult ? geriPtConsult.geriPtConsultQ2 == "Yes"   
								? blueRedText(geriPtConsult.geriPtConsultQ2, "Please check if participant has visited the Doctor's Consult Station.") 
								: blueText(geriPtConsult.geriPtConsultQ12)
						   : "-"}
			<br></br>
			{underlined("Reasons for referral:")}
			{geriPtConsult ? blueText(geriPtConsult.geriPtConsultQ3) : "-"}
			<br></br>
			{underlined("Was the participant referred for Social Service?")}
			{geriPtConsult ? geriPtConsult.geriPtConsultQ4 == "Yes"
								? blueRedText(geriPtConsult.geriPtConsultQ4, "Please check if participant has visited the Social Service Station.") 
								: blueText(geriPtConsult.geriPtConsultQ4)
							: "-"}
			<br></br>
			{underlined("Reasons for referral:")}
			{geriPtConsult ? blueText(geriPtConsult.geriPtConsultQ5) : "-"}
			<br></br>
			{bold("e. Geriatrics - OT consult")}
			{underlined("Memo from OT:")}
			{geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ1) : "-"}
			<br></br>
			{underlined("Was participant referred for Doctor's Consult?")}
			{geriOtConsult ? geriOtConsult.geriOtConsultQ2 == "Yes" 
								? blueRedText(geriOtConsult.geriOtConsultQ2, "Please check if participant has visited the Doctor's Consult Station.") 
								: blueText(geriOtConsult.geriOtConsultQ2)
							: "-"}
			<br></br>
			{underlined("Reasons for referral:")}
			{geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ3) : "-"}
			<br></br>
			{underlined("Was the participant referred for Social Service?:")}
			{geriOtConsult ? geriOtConsult.geriOtConsultQ4 == "Yes" 
								? blueRedText(geriOtConsult.geriOtConsultQ4, "Please check if participant has visited the Social Service Station.") 
								: blueText(geriOtConsult.geriOtConsultQ4)
							: "-"}
			<br></br>
			{underlined("Reasons for referral:")}
			{geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ5) : "-"}
			<br></br>
			{underlined("Which of the programmes did the OT recommend for the participant to go? (if applicable)")}
			{geriOtConsult ? blueText(geriOtConsult.geriOtConsultQ6) : "-"}
			<br></br>
			{bold("f. Geriatrics - Vision")}
			{underlined("Visual acuity (VA) scores")}
			{formatGeriVision(vision.geriVisionQ3, 3)}
			<br></br>
			{formatGeriVision(vision.geriVisionQ4, 4)}
			<br></br>
			{formatGeriVision(vision.geriVisionQ5, 5)}
			<br></br>
			{formatGeriVision(vision.geriVisionQ6, 6)}
			<br></br>
			{underlined("Participant referred to Doctor's Consult?")}
			{geriOtConsult ? geriVision.geriVisionQ9 == "Referred to Doctor's Consult"
							? blueRedText(geriVision.geriVisionQ9, "Please check if participant has visited the Doctor's Consult Station.")
							: blueText(geriVision.geriVisionQ9)
						   : '-'}
			<br></br>

			{bold("g. Geriatrics - Audiometry")}
			{underlined("Did participant visit Audiometry Station by NUS Audiology team?")}
			{geriOtConsult ? blueText(geriAudiometry.geriAudiometryQ1) : "-"}
			<br></br>
			{underlined("Participant referred to Doctor's Consult?")}
			{geriAudiometry.geriAudiometryQ11 == "Yes"
					? blueRedText(geriAudiometry.geriAudiometryQ11, "Please check if participant has visited the Doctor's Consult Station.")
					: blueText(geriAudiometry.geriAudiometryQ11)}
			<br></br>

			{bold("h. Geriatrics - Functional Screening ")}
			{underlined("Did participant attend PHS vision and hearing screening?")}
			{blueText(geriGeriAppt.geriGeriApptQ12)}
			<br></br>
			{underlined("Did participant apply for HPB functional screening? ")}
			{geriGeriAppt.geriGeriApptQ14 == "Yes"
				? blueRedText(geriGeriAppt.geriGeriApptQ14, "Please advise the participant that they may be followed-up by HPB regarding nearby"
															+ " functional screenings. Please remind them that they applied for a specific"
															+ " date and timings if applicable.")
				: blueText(geriGeriAppt.geriGeriApptQ14)}
			<br></br>
			{underlined("If participant applied for HPB screening, which event will they be going to? (event; date): ")}
			{blueText(geriFunctionalScreening.geriFunctionalScreeningRegFormQ3)}
			<br></br>
			{underlined("Participant referred to Doctor's Consult?")}
			{blueText(geriFunctionalScreening.geriFunctionalScreeningRegFormQ5)}
			<br></br>


			{bold("i. Geriatrics - Appointment")}
			<br></br>
			{underlined("Were spectacle vouchers given to participant for VA ≥ 6/12?")}
			{geriGeriAppt.geriGeriApptQ4 == "Yes"
				? blueRedText(geriGeriAppt.geriGeriApptQ4,  "Please advise the participant to use the vouchers before the expiry date (reflected on voucher).")
				: blueText(geriGeriAppt.geriGeriApptQ4)}
			<br></br>
			{underlined("Eligible for SWCDC Safe & Sustainable Homes Programme?")}
			{geriGeriAppt ? blueText(geriGeriAppt.geriGeriApptQ6) : "-"}
			<br></br>
			{underlined("Interest in signing up?")}
			{geriGeriAppt ? blueText(geriGeriAppt.geriGeriApptQ7) : "-"}
			<br></br>
			{underlined("Sign up form for SWCDC filled in?")}
			{geriGeriAppt ? blueRedText(geriGeriAppt.geriGeriApptQ8, "Please advise the participant that SWCDC will process their application and contact them separately.") : "-"}
			<br></br>
			{underlined("Eligible for HDB EASE??")}
			{geriGeriAppt ? blueText(geriGeriAppt.geriGeriApptQ9) : "-"}
			<br></br>
			{underlined("Interest in signing up?")}
			{geriGeriAppt ? blueText(geriGeriAppt.geriGeriApptQ10) : "-"}
			<br></br>
			{underlined("Referred to Social Service for HDB EASE Application?")}
			{geriGeriAppt.geriGeriApptQ13 == "Yes"
				? blueRedText(geriGeriAppt.geriGeriApptQ13,  "Please check if participant visisted the Social Service station for completion of his/her HDB EASE Application.")
				: blueText(geriGeriAppt.geriGeriApptQ13)}
			<br></br>

			<br></br>
			{bold("17. Doctor's Consult")}
			{underlined("Did this patient consult an on-site doctor today?")}
			{doctorSConsult ? doctorSConsult.doctorSConsultQ11 || typeof doctorSConsult.doctorSConsultQ11 == 'undefined'
								? blueRedText("Yes", 'Please check with participant if they have received a memo from the on-site Doctor.')
								: blueText("No")
							: "-"}
			<br></br>
			{underlined("Doctor's name:")}
			{doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ1) : "-"}
			<br></br>
			{underlined("Doctor's memo (if applicable):")}
			{doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ3) : "-"}
			<br></br>
			{underlined("Does this patient require urgent follow-up?")}
			{doctorSConsult ? doctorSConsult.doctorSConsultQ10 
								? blueRedText(doctorSConsult.doctorSConsultQ10 + '\nIf the on-site doctor has advised that you need urgent follow-up or you need to visit a GP/polyclinic/hospital, please do as instructed.')
								: blueText(doctorSConsult.doctorSConsultQ10) 
							: "-"}
			<br></br>
			{underlined("Was the participant referred for Dietitian's Consult?")}
			{doctorSConsult ? doctorSConsult.doctorSConsultQ4
								? blueRedText("Yes", "Please check if participant visited the Dietitian's Consult Station.")
								: blueText("No") 
							: '-'}
			<br></br>
			{underlined("Reasons for referral:")}
			{doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ5) : '-'}
			<br></br>
			{underlined("Was participant referred for Social Service?")}
			{doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ6)
								? blueRedText("Yes", "Please check if participant visited the Social Service Station.")
								: blueText("No")
							: '-'}
			<br></br>
			{underlined("Reasons for referral:")}
			{doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ7) : '-'}
			<br></br>
			{underlined("Was participant referred for Oral Health Station?")}
			{doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ8)
								? blueRedText("Yes", "Please check if participant visited the Oral Health Station.")
								: blueText("No") 
							: '-'}
			<br></br>
			{underlined("Reasons for referral:")}
			{doctorSConsult ? blueText(doctorSConsult.doctorSConsultQ9) : '-'}
			<br></br>

			{bold("18. Dietitian's Consult")}
			{underlined("Did this participant visit the Dietitian's Consult Station today?")}
			{dietitiansConsult ? dietitiansConsult.dietitiansConsultQ7 == "No"
									? blueRedText(dietitiansConsult.dietitiansConsultQ7, "Please check form A and above sections if the participant is"
																						 +  " flagged for Dietitian's Consult Station.")
									: blueText(dietitiansConsult.dietitiansConsultQ7)
							   : "-"}
			<br></br>
			{underlined("Dietitian's name:")}
			{dietitiansConsult ? blueText(dietitiansConsult.dietitiansConsultQ1) : '-'}
			<br></br>
			{underlined("Notes for participant (if applicable):")}
			{dietitiansConsult ? dietitiansConsult.dietitiansConsultQ4
									? blueText("Yes")
									: blueText("No")
								: "-"}
			<br></br>
			{underlined("Does participant require urgent follow-up?")}
			{dietitiansConsult ? dietitiansConsult.dietitiansConsultQ5
									? blueText("Yes")
									: blueText("No")
							   : "-"}
			<br></br>
			{underlined("Reasons for urgent follow-up:")}
			{dietitiansConsult ? blueText(dietitiansConsult.dietitiansConsultQ6) : '-'}
			<br></br>
			{socialService ? socialService.socialServiceQ1 == "Yes"
							? redText("Kindly encourage the participant to follow through with recommendations from the Dietitian.")
							: ""
						   : ""}
			<br></br>

			{bold("19. Social Service")}
			{underlined("Did this participant visit the social service station today?")}
			{socialService ? socialService.socialServiceQ1 == "No"
							? blueRedText(socialService.socialServiceQ1, "Please check form A and above sections if the participant is flagged for Social Service Station.") 
							: blueText(socialService.socialServiceQ1)
						: '-'}
			<br></br>
			{underlined("What will be done for the participant?")}
			{socialService ? blueText(socialService.socialServiceQ3) : '-'}
			<br></br>
			{underlined("SACS referral form filled-up?")}
			{socialService ? socialService.socialServiceQ6
							? blueRedText("Yes", "Please advise the participant that they may be followed-up by SACS regarding their application status for the programmes.")
							: blueText("No")
						: '-'}
			<br></br>
			{underlined("Is follow-up required?")}
			{socialService ? socialService.socialServiceQ4
							? blueText("Yes")
							: blueText("No") 
						: '-'}
			<br></br>
			{underlined("Brief summary of follow-up for the participant:")}
			{socialService ? blueText(socialService.socialServiceQ5) : '-'}
			<br></br>
			{socialService ? socialService.socialServiceQ1 == "Yes"
							? redText("Kindly encourage the participant to follow through with recommendations from AIC.")
							: ""
						   : ""}
			<br></br>
			{underlined("Completed HDB EASE application?")}
			{socialService ? socialService.socialServiceQ7
							? blueRedText("Yes", "Please advice upon receipt of the application and the relevant documents (if required),"
											      + " the HDB Branch managing your estate will reply to you within 7 working days.")
							: blueText("No")
						   : "-"}
			<br></br>
			{underlined("Completed CHAS application?")}
			{socialService ? socialService.socialServiceQ8
							? blueRedText("Yes", "Inform participant that application takes 15 working days from the"
												  + " date of receipt of the completed application to process. Successful applicants"
												  + " and their household members will receive a CHAS card that indicates the subsidy"
												  + " tier they are eligible for, as well as a welcome pack with information on the"
												  + " use of the card.")
							: blueText("No")
						   : "-"}
			<br></br>
			{underlined("Reasons for not completing above (if any):")}
			{socialService ? blueText(socialService.socialServiceQ9) : '-'}
			<br></br>

			{bold("20. Oral Health")}
			{underlined("Did this participant visit the Oral Health station today?")}
			{oralHealth ? oralHealth.oralHealthQ2
							? blueText("Yes")
							: blueText("No")
						: "-"}
			<br></br>
			{underlined("Will participant undergo follow-up by NUS Dentistry ")}
			{oralHealth ? oralHealth.oralHealthQ1	
							? blueRedText("Yes", "Kindly remind participants that NUS Dentistry will contact you regarding your future oral health appointments.")
							: blueText("No.")
						: '-'}
			<br></br>

			<br></br>
			{bold("21. Mailing Details")}
			{underlined("Preferred clinic:")}
			{registration ? blueText(registration.registrationQ10) : '-'}
			<br></br>
			{underlined("Preferred language for health report:")}
			{registration ? blueText(registration.registrationQ11) : '-'}
			<br></br>
			{oralHealth ? blueText(oralHealth.oralHealthQ2) : '-'}
			<br></br>
			{redText("Participants who preferred Chinese/ Tamily/ Malay will receive the final translated report from PHS within 4-6 weeks of the screening. \n")}
			{redText("If participant has gone for phlebotomy, he/she will receive the blood test results from NUHS/PHS. \n\n\n\n")}
		</div>
		<div>
			<button onClick={() => generate_pdf(registration, patients, cancer, phlebotomy, fit, wce, doctorSConsult, socialService, geriMmse, geriVision, geriAudiometry, geriGeriAppt, dietitiansConsult, oralHealth, 
				 								geriFunctionalScreening)}>
				Download Screening Report
			</button>
		</div>
		</Fragment>
		}
      </Paper>
    );
}

SummaryForm.contextType = FormContext;

export default function Summaryform(props) {
  const navigate = useNavigate();
  return <SummaryForm {...props} navigate={navigate} />;
}