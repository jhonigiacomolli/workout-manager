export const validateNumberParams = (value?: any, defaultValue?: any) => {
  if (!value || !/^[0-9]+$/.test(value)) return defaultValue || ''

  return value
}

export const validateTextParams = (value?: any, defaultValue?: any) => {
  if (!value || !/^[a-zA-Z0-9]+$/.test(value)) return defaultValue || ''

  return value
}

export const validateOrderParams = (value?: any) => {
  const orders = ['ASC', 'DESC']

  value = value?.toUpperCase()

  if (!value || !/^[a-zA-Z]+$/.test(value) || !orders.includes(value)) return 'DESC'

  return value
}
