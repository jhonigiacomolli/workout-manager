import { client } from '@/database'
import { Group } from '@/protocols/use-cases/group'
import { HTTPRequestParams } from '@/protocols/models/http'
import { CreateGroupModel, GroupModel } from '@/protocols/models/group'

export class PgGroupRepository implements Group {
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

    return rows.map(board => ({
      id: board.id,
      createdAt: board.created_at,
      title: board.title,
      elements: board.elements,
    }))[0]
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

    return rows.map(board => ({
      id: board.id,
      createdAt: board.created_at,
      title: board.title,
      elements: board.elements,
    }))
  }

  async getById(id: string): Promise<GroupModel | undefined> {
    const { rows } = await client.query('SELECT * FROM groups WHERE id=$1', [id])

    return rows.map(board => ({
      id: board.id,
      createdAt: board.created_at,
      title: board.title,
      elements: board.elements,
    }))[0]
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

    return rows.map(row => ({
      id: row.id,
      createdAt: row.created_at,
      title: row.title,
      elements: row.elements,
    }))[0]
  }
}
