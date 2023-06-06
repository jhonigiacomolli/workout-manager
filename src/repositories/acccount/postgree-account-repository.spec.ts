import { client } from "@/database";
import { PgAccountRepository } from "./postgres-account-repository";
import { makeFakeAccount } from "@/mocks/account/make-fake-account";

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn().mockReturnValueOnce({
      rows: [],
      rowCount: 1,
    }),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

const makeSut = () => {
  const sut = new PgAccountRepository()
  const params = makeFakeAccount()

  return {
    sut, params,
  }
}

describe('Postgree Account Repository', () => {
  describe('create()', () => {
    test('Should return true when account register succeeds', async () => {
      const {sut, params} = makeSut()
      const result = await sut.create(params)
      expect(result).toBeTruthy()
    });
    test('Should return 500 when account register fails', async () => {
      const {sut, params} = makeSut()
      jest.spyOn(client, 'query').mockImplementationOnce(() => { throw new Error() })
      const result = sut.create(params)
      expect(result).rejects.toThrowError()
    });
  });
});
