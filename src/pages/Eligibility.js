import React, { useState, useContext, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Box, TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { getSavedData, getSavedPatientData } from '../services/mongoDB';
import { FormContext } from '../api/utils.js';
import allForms from '../forms/forms.json';

const Eligibility = () => {
    const { patientId } = useContext(FormContext);
    const [reg, setReg] = useState({});
    const [pmhx, setPMHX] = useState({});
    const [social, setSocial] = useState({});
    const [patient, setPatient] = useState({});
    const [hxfamily, setHxFamily] = useState({});
    const [triage, setTriage] = useState({});
    const [hcsr, setHcsr] = useState({});
    const [oral, setOral] = useState({});
    const [wce, setWce] = useState({});

    useEffect(() => {
        const loadPastForms = async () => {
            const pmhxData = getSavedData(patientId, allForms.hxNssForm);
            const socialData = getSavedData(patientId, allForms.hxSocialForm);
            const regData = getSavedData(patientId, allForms.registrationForm);
            const patientData = getSavedPatientData(patientId, 'patients');
            const hxFamilyData = getSavedData(patientId, allForms.hxFamilyForm);
            const triageData = getSavedData(patientId, allForms.triageForm);
            const hcsrData = getSavedData(patientId, allForms.hxHcsrForm);
            const oralData = getSavedData(patientId, allForms.oralHealthForm);
            const wceData = getSavedData(patientId, allForms.wceForm);

            Promise.all([
                pmhxData,
                socialData,
                regData,
                patientData,
                hxFamilyData,
                triageData,
                hcsrData,
                oralData, 
                wceData
            ]).then((result) => {
                setPMHX(result[0]);
                setSocial(result[1]);
                setReg(result[2]);
                setPatient(result[3]);
                setHxFamily(result[4]);
                setTriage(result[5]);
                setHcsr(result[6]);
                setOral(result[7]);
                setWce(result[8]);
            });
        };
        loadPastForms();
    }, [patientId]);

    function createData(name, yes) {
        console.log("patient gender", wce.wceQ7);
        return { name, yes};
    }

    const isPhlebotomyEligible = reg?.registrationQ15 === 'YES' && reg?.registrationQ16 && reg?.registrationQ17;
    const isVaccinationEligible = pmhx?.pmhxQ16 !== 'YES';
    const isHealthierSGEligible = reg?.registrationQ11 !== 'YES';
    const isLungFunctionEligible = social?.socialQ10 === 'YES' || social?.socialQ11 === 'YES';
    const isFITEligible = reg?.registrationQ4 >= 50 && pmhx?.pmhxQ10 !== 'YES' && pmhx?.pmhxQ11 !== 'YES';
    const isWomenCancerEducationEligible = patient?.gender === 'Female';
    const isOsteoporosisEligible = patient?.gender === 'Female' && reg?.registrationQ4 >= 45;
    const isNKFEligible = (pmhx?.pmhxQ7 === 'YES' || hxfamily?.familyQ3 === 'YES' || triage?.triageQ12 >= 27.5) && pmhx?.pmhxQ9 !== 'YES' && reg?.registrationQ4 < 80;
    const isMentalHealthEligible = hcsr?.phqQ10 >= 10 && reg?.registrationQ4 < 60;
    const isAudiometryEligible = reg?.registrationQ4 >= 60 && pmhx?.pmhxQ13 !== 'YES';
    const isGeriatricScreeningEligible = reg?.registrationQ4 >= 60;
    const isOnSiteHPVTestingEligible = wce?.wceQ7 === 'YES';
    const isDoctorStationEligible = triage?.triageQ9 === 'YES' || hcsr?.hcsrQ3 === 'YES' || hcsr?.hcsrQ8 === 'YES' || pmhx?.pmhxQ12 === 'YES';
    const isDietitianEligible = social?.socialQ15 === 'YES';
    const isSocialServicesEligible = social?.socialQ6 === 'YES' || social?.socialQ7 === 'YES' || social?.socialQ9 !== 'YES';
    const isDentalEligible = social?.socialQ10 === 'YES' || social?.socialQ11 === 'YES' || pmhx?.pmhxQ7 === 'YES' || reg?.registrationQ5 > 60 || oral?.oralQ1 === 'Moderate' || oral?.oralQ1 === 'Poor' || oral?.oralQ2 === 'YES' || oral?.oralQ3 === 'YES' || oral?.oralQ4 !== 'YES' || oral?.oralQ5 === 'YES';

    const rows = [
        createData('Phlebotomy', isPhlebotomyEligible ? 'YES' : 'NO'),
        createData('Vaccination', isVaccinationEligible ? 'YES' : 'NO'),
        createData('Healthier SG Booth', isHealthierSGEligible ? 'YES' : 'NO'),
        createData('Faecal Immunochemical Testing (FIT)', isFITEligible ? 'YES' : 'NO'),
        createData('Lung Function Testing', isLungFunctionEligible ? 'YES' : 'NO'),
        createData("Women's Cancer Education", isWomenCancerEducationEligible ? 'YES' : 'NO'),
        createData('Osteoporosis', isOsteoporosisEligible ? 'YES' : 'NO'),
        createData('Kidney Screening', isNKFEligible ? 'YES' : 'NO'),
        createData('Mental Health', isMentalHealthEligible ? 'YES' : 'NO'),
        createData('Audiometry', isAudiometryEligible ? 'YES' : 'NO'),
        createData('HPV On-Site Testing', isOnSiteHPVTestingEligible ? 'YES' : 'NO'),
        createData('Geriatric Screening', isGeriatricScreeningEligible ? 'YES' : 'NO'),
        createData("Doctor's Station", isDoctorStationEligible ? 'YES' : 'NO'),
        createData("Dietitian's Consult", isDietitianEligible ? 'YES' : 'NO'),
        createData('Social Services', isSocialServicesEligible ? 'YES' : 'NO'),
        createData('Dental', isDentalEligible ? 'YES' : 'NO'),
    ];

    const getCellStyle = (value) => ({
        color: 'blue',
    });

    return (
        <>
            <Helmet>
                <title>Patient Eligibility</title>
            </Helmet>
            <Box sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                py: 3,
            }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Modality</TableCell>
                                <TableCell>ELIGIBILITY (highlighted in blue)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell sx={getCellStyle(row.yes)} >
                                        {row.yes}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default Eligibility;