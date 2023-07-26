import { client } from '@/database'
import { type AccountModel } from '@/protocols/models/account'
import { HTTPPaginationAndOrderParams } from '@/protocols/models/http'
import { type Account, type CreateAccountParams } from '@/protocols/use-cases/account'

export class PgAccountRepository implements Account {
  async create(account: CreateAccountParams): Promise<AccountModel> {
    const result = await client.query(`INSERT INTO accounts(
      name,
      created_at,
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
    ) VALUES($1, CURRENT_TIMESTAMP , $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING
      COALESCE(name, '') as name,
      COALESCE(email, '') as email,
      COALESCE(image, '') as image,
      COALESCE(phone, '') as phone,
      COALESCE(address, '') as address,
      COALESCE(boards, ARRAY[]::text[]) AS boards,
      COALESCE(responsability, ARRAY[]::text[]) AS responsability,
      COALESCE(status, ARRAY[]::text[]) AS status,
      COALESCE(desktops, ARRAY[]::text[]) AS desktops,
      COALESCE(tasks, ARRAY[]::text[]) AS tasks,
      COALESCE(permissions, ARRAY[]::text[]) AS permissions
    `, [
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

    console.log('Data: ', result)
    return result.rows[0]
  }

  async getUserByEmail(email: string): Promise<AccountModel> {
    const { rows } = await client.query('SELECT * FROM accounts WHERE email=$1', [email])

    return rows[0]
  }

  async getAllAccounts(params: HTTPPaginationAndOrderParams): Promise<AccountModel[]> {
    try {
      const { rows } = await client.query(`
        SELECT
        id,
        name,
        created_at,
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
        FROM accounts
        ORDER BY ${params.orderBy} ${params.order}
        LIMIT $1
        OFFSET $2::integer * $1::integer
      `, [params.limit, params.offset])

      return rows.map(row => {
        // eslint-disable-next-line
        const { created_at, ...rowItems } = row
        return {
          ...rowItems,
          // eslint-disable-next-line
          createdAt: created_at,
        }
      })
    } catch {
      return []
    }
  }

  async checkEmailInUse(email: string): Promise<boolean> {
    const { rowCount } = await client.query('SELECT id FROM accounts WHERE email=$1', [email])

    return rowCount > 0
  }

  async setUserById(accountId: string, data: CreateAccountParams): Promise<boolean> {
    const { rowCount } = await client.query(`
    UPDATE accounts
    SET
      name=$2,
      email=$3,
      password=$4,
      image=$5,
      permissions=$6,
      phone=$7,
      address=$8,
      boards=$9,
      desktops=$10,
      responsability=$11,
      status=$12,
      tasks=$13,
      teamId=$14
    WHERE id=$1
  `, [
      accountId,
      data.name,
      data.email,
      data.password,
      data.image,
      data.permissions,
      data.phone,
      data.address,
      data.boards,
      data.desktops,
      data.responsability,
      data.status,
      data.tasks,
      data.teamId,
    ])

    return rowCount > 0
  }

  async delete(accountId: string): Promise<boolean> {
    try {
      const { rowCount } = await client.query(
        'DELETE FROM accounts WHERE ID=$1',
        [accountId],
      )

      return rowCount > 0
    } catch {
      return false
    }
  }
}
