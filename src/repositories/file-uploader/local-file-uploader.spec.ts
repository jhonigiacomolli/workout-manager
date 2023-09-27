import fs from 'fs'
import * as crypto from 'crypto'
import path, { join } from 'path'
import { File } from '@/protocols/models/file'
import { LocalFileUploaderRepository } from './local-file-uploader'

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  existsSync: jest.fn(),
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
    close: jest.fn(),
  })),
}))

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'hashed-filename'),
}))

const makeSut = () => {
  const fakeImage: File = {
    filename: 'any-image.png',
    extension: 'png',
    mime: 'image/png',
    data: 'any-data-file-string',
  }
  const sut = new LocalFileUploaderRepository()

  return { sut, fakeImage }
}

describe('LocalFileUploaderRepository', () => {
  test('Should return null if a file param provided is invalid', async () => {
    const { sut, fakeImage } = makeSut()

    const output = await sut.uploadImage({} as File)

    expect(output).toBeNull()

    const newOutput = await sut.uploadImage({
      ...fakeImage,
      mime: '',
    })

    expect(newOutput).toBeNull()
  })

  test('Should return null if a file have invalid mime type', async () => {
    const { sut, fakeImage } = makeSut()

    const fakeWrongImage = {
      ...fakeImage,
      mime: 'application/pdf',
      extension: '.pdf',
    }

    const output = await sut.uploadImage(fakeWrongImage)

    expect(output).toBeNull()
  })

  test('Should check id uploads directory exist', async () => {
    const { sut, fakeImage } = makeSut()

    const fsSpy = jest.spyOn(fs, 'existsSync')

    await sut.uploadImage(fakeImage)

    expect(fsSpy).toHaveBeenCalledWith(path.resolve('public/uploads'))
  })

  test('Should create uploads directory if does not exist', async () => {
    const { sut, fakeImage } = makeSut()

    jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false)

    const fsSpy = jest.spyOn(fs, 'mkdirSync')

    await sut.uploadImage(fakeImage)

    expect(fsSpy).toHaveBeenCalledWith(path.resolve('public/uploads'))
  })

  test('Should call randomUUID method with correct value', async () => {
    const { sut, fakeImage } = makeSut()

    const cryptoSpy = jest.spyOn(crypto, 'randomUUID')
    await sut.uploadImage(fakeImage)

    expect(cryptoSpy).toHaveBeenCalledTimes(1)
  })

  test('Should save file if proccess succeeds', async () => {
    const { sut, fakeImage } = makeSut()

    const fsSpy = jest.spyOn(fs, 'createWriteStream')

    const output = await sut.uploadImage(fakeImage)
    const outputDirPath = path.resolve('public/uploads')
    const outputFilePath = `/hashed-filename.${fakeImage.extension}`

    expect(fsSpy).toHaveBeenCalledWith(join(outputDirPath, outputFilePath))
    expect(output).toBe('/uploads' + outputFilePath)
  })
})
