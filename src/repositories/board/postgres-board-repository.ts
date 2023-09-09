import { client } from '@/database'
import { BoardModel } from '@/protocols/models/board'
import { HTTPRequestParams } from '@/protocols/models/http'
import { Board, CreateBoardParams, UpdateBoardParams } from '@/protocols/use-cases/board'

export class PgBoardReposytory implements Board {
  async create(board: CreateBoardParams): Promise<BoardModel> {
    const { rows } = await client.query(`INSERT INTO boards(
      title,
      created_at,
      format,
      groups
    ) VALUES($1, CURRENT_TIMESTAMP , $2, $3) RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(format, '') as format,
      COALESCE(groups, ARRAY[]::text[]) AS groups
    `, [
      board.title,
      board.format,
      board.groups,
    ])

    // eslint-disable-next-line
    return rows.map(({ created_at, ...board }) => ({
      ...board,
      // eslint-disable-next-line
      createdAt: created_at,
    }))[0]
  }

  // async delete(id: string): Promise<boolean> {
  //   if (!id) return false

  //   const { rowCount } = await client.query('DELETE FROM workspaces WHERE id=$1', [id])
  //   return rowCount > 0
  // }

  async getAll(params: HTTPRequestParams): Promise<BoardModel[]> {
    if (params.orderBy === 'createdAt') {
      params.orderBy = 'created_at'
    }

    const { rows } = await client.query(`
      SELECT * FROM boards
      ORDER BY ${params.orderBy} ${params.order}
      LIMIT $1
      OFFSET $2:: integer * $1:: integer;
    `, [params.limit, params.offset])

    return rows.map(board => ({
      id: board.id,
      createdAt: board.created_at,
      title: board.title,
      format: board.format,
      groups: board.groups,
    }))
  }

  async getById(id: string): Promise<BoardModel | undefined> {
    const { rows } = await client.query('SELECT * FROM boards WHERE id=$1', [id])

    return rows.map(board => ({
      id: board.id,
      createdAt: board.created_at,
      title: board.title,
      format: board.format,
      groups: board.groups,
    }))[0]
  }

  async setById(id: string, data: Partial<BoardModel>): Promise<BoardModel> {
    const { rows } = await client.query(`
      UPDATE boards
      SET
        title=COALESCE($2,title),
        format=COALESCE($3,format),
        groups=COALESCE($4,groups)
      WHERE id=$1 RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(format, '') as description,
      COALESCE(groups, ARRAY[]::text[]) AS groups
    `, [id, data.title, data.format, data.groups])

    return rows.map(row => ({
      id: row.id,
      createdAt: row.created_at,
      title: row.title,
      format: row.format,
      groups: row.groups,
    }))[0]
  }
}
