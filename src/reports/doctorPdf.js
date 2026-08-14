import updatedLogo from 'src/icons/UpdatedIcon'
import { getSavedData } from '../services/patientData'
import pdfMake from './pdfMake'

export const generateDoctorPdf = async (entry) => {
  const savedDoctorConsultData = await getSavedData(entry.patientId, 'doctorConsultForm')
  console.log('savedDoctorConsultData: ', savedDoctorConsultData)

  const generateHeader = () => ({
    margin: [40, 30, 40, 10],
    stack: [
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            stack: [
              {
                text: 'PHS 2026',
                bold: true,
                fontSize: 16,
                alignment: 'center',
                margin: [0, 0, 0, 2],
              },
              {
                text: "DOCTOR'S STATION",
                bold: true,
                fontSize: 16,
                alignment: 'center',
                margin: [0, 0, 0, 2],
              },
              { text: 'MEMO SHEET', bold: true, fontSize: 16, alignment: 'center' },
            ],
          },
          {
            width: '*',
            stack: [
              {
                image: updatedLogo,
                width: 115,
                alignment: 'right',
                margin: [-10, -10, 0, 0],
              },
            ],
          },
        ],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 10, 0, 0],
      },
    ],
  })

  const generateMemoBody = () => {
    const content = [
      { text: 'Memo for ______________________', margin: [0, 20, 0, 2], alignment: 'center' },
      { text: 'NRIC: ______________________', margin: [0, 6, 0, 2], alignment: 'center' },
      { text: 'Dear Colleague:', margin: [0, 15, 0, 10] },

      {
        stack: [
          { text: "Doctor's Memo:", bold: true, decoration: 'underline', margin: [0, 2, 0, 2] },
          { text: savedDoctorConsultData?.doctorSConsultQ2 || 'No response' },
        ],
        margin: [0, 2, 0, 5],
      },

      {
        stack: [
          { text: 'Clinical Findings:', bold: true, decoration: 'underline', margin: [0, 2, 0, 2] },
          { text: savedDoctorConsultData?.doctorSConsultQ3 || 'No response' },
        ],
        margin: [0, 2, 0, 10],
      },
    ]

    content.push({ text: '\nThank you very much.', margin: [0, 2, 0, 10] })

    return content
  }

  const generateSignatureBlock = () => ({
    margin: [0, 0, 0, 20],
    stack: [
      {
        text: 'Yours Sincerely,\nDr\nMCR:\nPhysician volunteer\nPublic Health Service',
        margin: [0, 10, 0, 2],
      },
      {
        text: "NUS Medical Society, c/o The Dean's Office, NUS Yong Loo Lin School of Medicine\n1E Kent Ridge Road, NUHS Tower Block Level 11, Singapore 119228",
      },
    ],
  })

  const generateFooter = () => ({
    margin: [40, 60, 40, 20],
    columns: [
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1.2, lineColor: '#1b73e8' },
        ],
        width: 100,
      },
      {
        text: 'Public Health Service 2026 [\u00A0\u00A0]',
        alignment: 'right',
        fontSize: 9,
      },
    ],
  })

  const docDefinition = {
    content: [generateMemoBody(), generateSignatureBlock()],
    header: generateHeader,
    footer: generateFooter,
    pageMargins: [40, 110, 40, 120],
    defaultStyle: { fontSize: 10 },
  }

  pdfMake.createPdf(docDefinition).download(`DoctorConsult_${entry.patientId}.pdf`)
}
