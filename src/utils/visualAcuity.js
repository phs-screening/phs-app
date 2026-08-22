export const formatVisualAcuity = (value) =>
  value === null || value === undefined || value === '' ? '6/___' : `6/${value}`
