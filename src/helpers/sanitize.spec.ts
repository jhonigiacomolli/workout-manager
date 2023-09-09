import { validateNumberParams, validateOrderParams, validateTextParams } from './sanitize'

describe('Sanitize', () => {
  test('validateNumberParams()', () => {
    const result = validateNumberParams('123456')
    expect(result).toBeTruthy()

    const falseResult = validateNumberParams('1234asdasd56')
    expect(falseResult).toBeFalsy()

    const falseResultWithSpecial = validateNumberParams('1234;;;d56')
    expect(falseResultWithSpecial).toBeFalsy()
  })
  test('validateTextParams()', () => {
    const result = validateTextParams('onlytext')
    expect(result).toBeTruthy()

    const resultWithNumbers = validateTextParams('onlytextand123')
    expect(resultWithNumbers).toBeTruthy()

    const falseResult = validateTextParams('i_have_special_caracters')
    expect(falseResult).toBeFalsy()

    const falseResultWithSpecial = validateTextParams('1234;;;d56')
    expect(falseResultWithSpecial).toBeFalsy()
  })
  test('validateOrderParams()', async () => {
    const ascResult = validateOrderParams('asc')
    expect(ascResult).toBe('ASC')

    const descResult = validateOrderParams('desc')
    expect(descResult).toBe('DESC')

    const emptyValueResult = validateOrderParams()
    expect(emptyValueResult).toBe('DESC')

    const emptyStringValueResult = validateOrderParams('')
    expect(emptyStringValueResult).toBe('DESC')

    const invalidParamValueResult = validateOrderParams('INVALID')

    expect(invalidParamValueResult).toBeFalsy()
  })
})
