import { httpResponse } from '@/helpers/http'
import { Account } from '@/protocols/use-cases/account'
import { AccountModel } from '@/protocols/models/account'
import { Controller } from '@/protocols/models/controller'
import { HTTPRequest, HTTPResponse } from '@/protocols/models/http'

type Dependencies = {
  account: Account
}

type AccountKeys = keyof AccountModel

export class LoadAllAccountsController implements Controller {
  constructor(private readonly dependencies: Dependencies) { }

  async handle(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { limit, page, offset, orderBy, order } = request.query.pagination

      const fields: AccountKeys[] = ['id', 'name', 'email', 'phone', 'address', 'status']

      const orderByField = fields.includes(orderBy) ? orderBy : 'name'

      const accounts = await this.dependencies.account.getAllAccounts({
        limit,
        page,
        offset,
        orderBy: orderByField,
        order,
      })

      return {
        statusCode: 200,
        body: accounts,
      }
    } catch {
      return httpResponse(500, 'Internal Server Error')
    }
  }
}
