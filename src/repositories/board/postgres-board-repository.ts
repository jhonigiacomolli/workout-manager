import { client } from '@/database'
import { BoardModel } from '@/protocols/models/board'
import { HTTPRequestParams } from '@/protocols/models/http'
import { Board, CreateBoardParams } from '@/protocols/use-cases/board'

type PostgresBoardModel = Omit<BoardModel, 'createdAt'> & {
  created_at: string
}
export class PgBoardReposytory implements Board {
  private convertPgBoardIntoBoard = (elements: PostgresBoardModel[]): BoardModel[] => {
    /* eslint-disable-next-line camelcase */
    return elements.map(({ id = '', created_at = '', title = '', format = 'kanban', groups = [] }) => ({
      id,
      /* eslint-disable-next-line camelcase */
      createdAt: created_at || '',
      title,
      format,
      groups,
    }))
  }

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

    return this.convertPgBoardIntoBoard(rows)[0]
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false

    const { rowCount } = await client.query('DELETE FROM boards WHERE id=$1', [id])
    return rowCount > 0
  }

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

    return this.convertPgBoardIntoBoard(rows)
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

    return this.convertPgBoardIntoBoard(rows)[0]
  }
}
