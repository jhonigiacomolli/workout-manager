export const paramValidation = (param: any, type: 'string' | 'array' | 'number' | 'object'): boolean => {
  const validations = {
    string: typeof param === 'string',
    array: Array.isArray(param),
    number: !Number.isNaN(param) && typeof param !== 'string' && typeof param !== 'object',
    object: typeof param === 'object' && !Array.isArray(param),
  }
  return validations[type]
}
