import { httpResponse } from '@/helpers/http'
import { makeFakeRequest } from '@/mocks/http'
import { TeamStub } from '@/mocks/teams/team-stub'
import { AccountModel } from '@/protocols/models/account'
import { AccountStub } from '@/mocks/account/account-stub'
import { makeFakeAccount } from '@/mocks/account/account-fakes'
import { AccountUdateController } from './account-update-controller'
import { FileManagerStub } from '@/mocks/file-manager/file-manager-stub'
import { BadRequestError, EmptyParamError, InvalidParamError } from '@/helpers/errors'

const makeSut = () => {
  const fakeRequest = makeFakeRequest({
    body: {
      ...makeFakeAccount(),
      passwordConfirmation: makeFakeAccount().password,
    },
  })

  const fakeRequestWithFile = {
    ...fakeRequest,
    files: {
      image: {
        filename: 'any-filename.pgn',
        mime: 'image/png',
        extenttion: 'png',
        data: 'only-image-data',
      },
    },
  }

  const accountStub = new AccountStub()
  const teamStub = new TeamStub()
  const fileManagerStub = new FileManagerStub()

  const sut = new AccountUdateController({
    account: accountStub,
    team: teamStub,
    fileManager: fileManagerStub,
  })

  return {
    sut,
    accountStub,
    teamStub,
    fileManagerStub,
    fakeRequest,
    fakeRequestWithFile,
  }
}

describe('Account Update Controller', () => {
  test('Should return 400 if setUserById method return false', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow(new BadRequestError('Account update fails'))
  })

  test('Should return 500 if setUserById method throws', async () => {
    const { sut, accountStub, fakeRequest } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockImplementationOnce(() => {
      throw new Error()
    })

    const output = sut.handle(fakeRequest)

    await expect(output).rejects.toThrow()
  })

  test('Should return 400 if id is not provided', async () => {
    const { sut, fakeRequest } = makeSut()

    const worngRequest = { ...fakeRequest }

    worngRequest.params = {}

    const output = sut.handle(worngRequest)

    await expect(output).rejects.toThrow(new EmptyParamError('id'))
  })

  test('Should return 400 if name is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        name: '',
      },
    })

    await expect(output).rejects.toThrow(new EmptyParamError('name'))
  })

  test('Should return 400 if email is not provided on body', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        email: '',
      },
    })

    await expect(output).rejects.toThrow(new EmptyParamError('email'))
  })

  test('Should return 400 if teamId is invalid', async () => {
    const { sut, fakeRequest, teamStub } = makeSut()

    jest.spyOn(teamStub, 'getTeamByID').mockReturnValueOnce(Promise.resolve(undefined))

    const output = sut.handle({
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        teamId: 'invalid_team_id',
      },
    })

    await expect(output).rejects.toThrow(new InvalidParamError('teamId'))
  })

  test('Should return call file uploader with image if image file is provided', async () => {
    const { sut, fakeRequestWithFile, fileManagerStub } = makeSut()

    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    await sut.handle(fakeRequestWithFile)

    expect(uploaderSpy).toHaveBeenCalledWith(fakeRequestWithFile.files.image)
    expect(uploaderSpy).toHaveBeenCalledTimes(1)
  })

  test('Should remove old image if new file is provided', async () => {
    const { sut, fakeRequestWithFile, fileManagerStub } = makeSut()

    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithFile)

    expect(removerSpy).toHaveBeenCalledWith(fakeRequestWithFile.body.image)
    expect(removerSpy).toHaveBeenCalledTimes(1)
  })

  test('Should do not call removeImage method if file is provided but do not have old image', async () => {
    const { sut, fakeRequestWithFile, accountStub, fileManagerStub } = makeSut()

    const { image, ...expectedAccount } = makeFakeAccount()
    jest.spyOn(accountStub, 'getUserById').mockReturnValueOnce(Promise.resolve(expectedAccount as AccountModel))
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithFile)

    expect(removerSpy).not.toHaveBeenCalledWith(fakeRequestWithFile.body.image)
    expect(removerSpy).toHaveBeenCalledTimes(0)
  })

  test('Should do not call removeImage method if file is provided but account returned is undefined', async () => {
    const { sut, fakeRequestWithFile, accountStub, fileManagerStub } = makeSut()

    jest.spyOn(accountStub, 'getUserById').mockReturnValueOnce(Promise.resolve(undefined))
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithFile)

    expect(removerSpy).not.toHaveBeenCalledWith(fakeRequestWithFile.body.image)
    expect(removerSpy).toHaveBeenCalledTimes(0)
  })

  test('Should return do not call file uploader with image if image file is not provided', async () => {
    const { sut, fakeRequest, fileManagerStub } = makeSut()

    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')

    await sut.handle(fakeRequest)

    expect(uploaderSpy).not.toHaveBeenCalled()
  })

  test('Should remove a old image if a body image param have to be a string and empty', async () => {
    const { sut, fakeRequest, fileManagerStub, accountStub } = makeSut()

    const fakeRequestWithEmptyImage = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        image: '',
      },
    }
    const accountSpy = jest.spyOn(accountStub, 'getUserById')
    const uploaderSpy = jest.spyOn(fileManagerStub, 'uploadImage')
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithEmptyImage)

    expect(accountSpy).toHaveBeenCalledWith(fakeRequest.params.id)
    expect(removerSpy).toHaveBeenCalledWith(fakeRequest.body.image)
    expect(uploaderSpy).not.toHaveBeenCalled()
  })

  test('Should remove a old image if a body image param have to be a string but not to be empty', async () => {
    const { sut, fakeRequest, fileManagerStub, accountStub } = makeSut()

    const fakeRequestWithEmptyImage = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        image: '/wrong-image-url',
      },
    }
    const accountGetSpy = jest.spyOn(accountStub, 'getUserById')
    const accountSetSpy = jest.spyOn(accountStub, 'setUserById')
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithEmptyImage)

    const { image, ...expectedBody } = fakeRequest.body

    expect(accountGetSpy).toHaveBeenCalledWith(fakeRequest.params.id)
    expect(removerSpy).not.toHaveBeenCalledWith(fakeRequest.body.image)
    expect(accountSetSpy).toHaveBeenCalledWith(fakeRequestWithEmptyImage.params.id, expectedBody)
  })

  test('Should remove a old image if a body image param have to be a string but not to be empty and account do not have a a image', async () => {
    const { sut, fakeRequest, fileManagerStub, accountStub } = makeSut()

    const fakeRequestWithEmptyImage = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        image: '/wrong-image-url',
      },
    }
    const accountGetSpy = jest.spyOn(accountStub, 'getUserById').mockReturnValueOnce(Promise.resolve(undefined))
    const accountSetSpy = jest.spyOn(accountStub, 'setUserById')
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithEmptyImage)

    const { image, ...expectedBody } = fakeRequest.body

    expect(accountGetSpy).toHaveBeenCalledWith(fakeRequest.params.id)
    expect(removerSpy).not.toHaveBeenCalledWith(fakeRequest.body.image)
    expect(accountSetSpy).toHaveBeenCalledWith(fakeRequestWithEmptyImage.params.id, expectedBody)
  })

  test('Should remove file method cannot be called if account do not have a image setted', async () => {
    const { sut, fakeRequest, fileManagerStub, accountStub } = makeSut()

    const fakeRequestWithEmptyImage = {
      ...fakeRequest,
      body: {
        ...fakeRequest.body,
        image: '',
      },
    }
    jest.spyOn(accountStub, 'getUserById').mockReturnValueOnce(Promise.resolve(undefined))
    const removerSpy = jest.spyOn(fileManagerStub, 'removeImage')

    await sut.handle(fakeRequestWithEmptyImage)

    expect(removerSpy).not.toHaveBeenCalledWith(fakeRequest.body.image)
  })

  test('Should return call setById with new image path if file is uploaded', async () => {
    const { sut, fakeRequest, fakeRequestWithFile, accountStub } = makeSut()

    const accountSpy = jest.spyOn(accountStub, 'setUserById')

    await sut.handle(fakeRequestWithFile)

    expect(accountSpy).toHaveBeenCalledWith(fakeRequest.params.id, {
      ...fakeRequest.body,
      image: '/uploads/any-file-uploaded.png',
    })
  })

  test('Should return account with image url if file is provided', async () => {
    const { sut, fakeRequest, fakeRequestWithFile } = makeSut()

    const outputWithFile = await sut.handle(fakeRequestWithFile)

    expect(outputWithFile.body.data.image).toBe(fakeRequest.baseUrl + '/uploads/any-file-uploaded.png')

    const outputWithoutFile = await sut.handle(fakeRequest)

    expect(outputWithoutFile.body.data.image).toBe(fakeRequest.baseUrl + '/uploads/any-file-uploaded.png')
  })

  test('Should return image url only when have a image setted', async () => {
    const { sut, fakeRequest, accountStub } = makeSut()

    jest.spyOn(accountStub, 'setUserById').mockReturnValueOnce(Promise.resolve({
      ...makeFakeAccount(),
      image: '',
    }))

    const output = await sut.handle(fakeRequest)

    const fakeAccount = makeFakeAccount()
    const expectedData = {
      ...fakeAccount,
      image: '',
    }

    expect(output).toEqual(httpResponse(200, {
      message: 'User updated successffuly',
      data: expectedData,
    }))
  })

  test('Should return 200 when update successfull', async () => {
    const { sut, fakeRequest } = makeSut()

    const output = await sut.handle(fakeRequest)

    const fakeAccount = makeFakeAccount()
    const expectedData = {
      ...fakeAccount,
      image: fakeRequest.baseUrl + fakeAccount.image,
    }

    expect(output).toEqual(httpResponse(200, {
      message: 'User updated successffuly',
      data: expectedData,
    }))
  })
})
