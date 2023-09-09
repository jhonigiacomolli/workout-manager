import { client } from '@/database'
import { type AccountModel } from '@/protocols/models/account'
import { HTTPPaginationAndOrderParams } from '@/protocols/models/http'
import { type Account, type CreateAccountParams } from '@/protocols/use-cases/account'

export class PgAccountRepository implements Account {
  async create(account: CreateAccountParams): Promise<AccountModel> {
    const { rows } = await client.query(`INSERT INTO accounts(
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
      id,
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
    // eslint-disable-next-line
    return rows.map(({ created_at, ...account }) => ({
      ...account,
      // eslint-disable-next-line
      createdAt: created_at,
    }))[0]
  }

  async getUserById(id: string): Promise<AccountModel | undefined> {
    const { rows } = await client.query('SELECT * FROM accounts WHERE id=$1', [id])

    return rows[0]
  }

  async getUserByEmail(email: string): Promise<AccountModel> {
    const { rows } = await client.query('SELECT * FROM accounts WHERE email=$1', [email])

    return rows[0]
  }

  async getAllAccounts(params: HTTPPaginationAndOrderParams): Promise<AccountModel[]> {
    const { rows } = await client.query(`
        SELECT
        id,
        COALESCE(name, '') as name,
        created_at,
        COALESCE(email, '') as email,
        COALESCE(image, '') as image,
        COALESCE(permissions, ARRAY[]::text[]) AS permissions,
        COALESCE(phone, '') as phone,
        COALESCE(address, '') as address,
        COALESCE(boards, ARRAY[]::text[]) AS boards,
        COALESCE(desktops, ARRAY[]::text[]) AS desktops,
        COALESCE(responsability, ARRAY[]::text[]) AS responsability,
        COALESCE(status, ARRAY[]::text[]) AS status,
        COALESCE(tasks, ARRAY[]::text[]) AS tasks,
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
  }

  async checkEmailInUse(email: string): Promise<boolean> {
    const { rowCount } = await client.query('SELECT id FROM accounts WHERE email=$1', [email])

    return rowCount > 0
  }

  async setUserById(accountId: string, data: CreateAccountParams): Promise<AccountModel | undefined> {
    const { rows } = await client.query(`
    UPDATE accounts
    SET
      name=COALESCE($2,name),
      email=COALESCE($3,email),
      password=COALESCE($4, password),
      image=COALESCE($5,image),
      permissions=COALESCE($6,permissions),
      phone=COALESCE($7,phone),
      address=COALESCE($8,address),
      boards=COALESCE($9,boards),
      desktops=COALESCE($10,desktops),
      responsability=COALESCE($11,responsability),
      status=COALESCE($12,status),
      tasks=COALESCE($13,tasks),
      teamId=COALESCE($14,teamId)
    WHERE id=$1 RETURNING
      id,
      created_at,
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

    // eslint-disable-next-line
    return rows.map(({ created_at, ...account }) => ({
      ...account,
      // eslint-disable-next-line
      createdAt: created_at,
    }))[0]
  }

  async delete(accountId: string): Promise<boolean> {
    const { rowCount } = await client.query(
      'DELETE FROM accounts WHERE ID=$1',
      [accountId],
    )

    return rowCount > 0
  }
}
