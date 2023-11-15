import { client } from '@/database'
import { Group } from '@/protocols/use-cases/group'
import { HTTPRequestParams } from '@/protocols/models/http'
import { CreateGroupModel, GroupModel } from '@/protocols/models/group'

type PostgresGroupModel = Omit<GroupModel, 'createdAt'> & {
  created_at: string
}
export class PgGroupRepository implements Group {
  /* eslint-disable camelcase */
  private convertPgGroupIntoGroupModel = (elements: PostgresGroupModel[]): GroupModel[] => {
    return elements.map(({
      id = '',
      title = '',
      created_at = '',
      elements = [],
    }) => ({
      id,
      createdAt: created_at || '',
      title,
      elements,
    }))
  }

  async create(board: CreateGroupModel): Promise<GroupModel> {
    const { rows } = await client.query(`INSERT INTO groups(
      title,
      created_at,
      elements
    ) VALUES($1, CURRENT_TIMESTAMP , $2) RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(elements, ARRAY[]::text[]) AS elements
    `, [
      board.title,
      board.elements,
    ])

    return this.convertPgGroupIntoGroupModel(rows)[0]
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false

    const { rowCount } = await client.query('DELETE FROM groups WHERE id=$1', [id])
    return rowCount > 0
  }

  async getAll(params: HTTPRequestParams): Promise<GroupModel[]> {
    if (params.orderBy === 'createdAt') {
      params.orderBy = 'created_at'
    }

    const { rows } = await client.query(`
      SELECT * FROM groups
      ORDER BY ${params.orderBy} ${params.order}
      LIMIT $1
      OFFSET $2:: integer * $1:: integer;
    `, [params.limit, params.offset])

    return this.convertPgGroupIntoGroupModel(rows)
  }

  async getById(id: string): Promise<GroupModel | undefined> {
    const { rows } = await client.query('SELECT * FROM groups WHERE id=$1', [id])

    return this.convertPgGroupIntoGroupModel(rows)[0]
  }

  async setById(id: string, data: Partial<GroupModel>): Promise<GroupModel> {
    const { rows } = await client.query(`
      UPDATE groups
      SET
        title=COALESCE($2,title),
        elements=COALESCE($3,elements)
      WHERE id=$1 RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(elements, ARRAY[]::text[]) AS elements
    `, [id, data.title, data.elements])

    return this.convertPgGroupIntoGroupModel(rows)[0]
  }
}
