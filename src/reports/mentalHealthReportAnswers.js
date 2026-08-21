export const getMentalHealthReportAnswer = (mentalHealth = {}, questionNumber) =>
  mentalHealth[`NTUC${questionNumber}`] ?? mentalHealth[`SAMH${questionNumber}`]
