import { client } from "@/database"
import { Account, CreateAccountParams } from "@/protocols/use-cases/account"

export class PgAccountRepository implements Account {
  async create(account: CreateAccountParams): Promise<boolean> {

    const { rowCount } = await client.query(`INSERT INTO accounts(
      name,
      email,
      password,
      image,
      permissions,
      phone,
      address,
      boards,
      desktops,
      responsability,
      status,
      tasks,
      teamId
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, [
      account.name,
      account.email,
      account.password,
      account.image,
      account.permissions,
      account.phone,
      account.address,
      account.boards,
      account.desktops,
      account.responsability,
      account.status,
      account.tasks,
      account.teamId,
    ])
    return Promise.resolve(rowCount > 0)
  }

  async checkEmailInUse(email: string): Promise<boolean> {

    const result = await client.query('SELECT id FROM accounts WHERE email=$1',[email])


    return result.rowCount > 0
  }
}
