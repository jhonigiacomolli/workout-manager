import { paramValidation } from './param-validation'

describe('paramValidation', () => {
  test('Should validate correct type of string params', () => {
    expect(paramValidation('15', 'string')).toBeTruthy()
    expect(paramValidation(15, 'string')).toBeFalsy()
    expect(paramValidation({}, 'string')).toBeFalsy()
    expect(paramValidation({ name: 'any string' }, 'string')).toBeFalsy()
    expect(paramValidation([], 'string')).toBeFalsy()
    expect(paramValidation(['any string'], 'string')).toBeFalsy()
  })
  test('Should validate correct type of object params', () => {
    expect(paramValidation({}, 'object')).toBeTruthy()
    expect(paramValidation({ name: 'any string' }, 'object')).toBeTruthy()
    expect(paramValidation(15, 'object')).toBeFalsy()
    expect(paramValidation('15', 'object')).toBeFalsy()
    expect(paramValidation([], 'object')).toBeFalsy()
    expect(paramValidation(['any string'], 'object')).toBeFalsy()
  })
  test('Should validate correct type of array params', () => {
    expect(paramValidation([], 'array')).toBeTruthy()
    expect(paramValidation(['any string'], 'array')).toBeTruthy()
    expect(paramValidation(15, 'array')).toBeFalsy()
    expect(paramValidation('15', 'array')).toBeFalsy()
    expect(paramValidation({}, 'array')).toBeFalsy()
    expect(paramValidation({ name: 'any string' }, 'array')).toBeFalsy()
  })
  test('Should validate correct type of number params', () => {
    expect(paramValidation(15, 'number')).toBeTruthy()
    expect(paramValidation('15', 'number')).toBeFalsy()
    expect(paramValidation({}, 'number')).toBeFalsy()
    expect(paramValidation({ name: 'any string' }, 'number')).toBeFalsy()
    expect(paramValidation([], 'number')).toBeFalsy()
    expect(paramValidation(['any string'], 'number')).toBeFalsy()
  })
})
