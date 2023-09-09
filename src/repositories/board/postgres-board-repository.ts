import { client } from '@/database'
import { BoardModel } from '@/protocols/models/board'
import { HTTPRequestParams } from '@/protocols/models/http'
import { Board, CreateBoardParams } from '@/protocols/use-cases/board'

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
    try {
      const { rows } = await client.query('SELECT * FROM boards WHERE id=$1', [id])

      return rows.map(board => ({
        id: board.id,
        createdAt: board.created_at,
        title: board.title,
        format: board.format,
        groups: board.groups,
      }))[0]
    } catch (error) {
      if (error.code === '22P02') {
        return undefined
      } else {
        throw error
      }
    }
  }

  // async setById(id: string, data: UpdateWorkspaceModel): Promise<WorkspaceModel> {
  //   const { rows } = await client.query(`
  //     UPDATE workspaces
  //     SET
  //       title=COALESCE($2,title),
  //       description=COALESCE($3,description),
  //       members=COALESCE($4,members),
  //       boards=COALESCE($5,boards),
  //       profileImage=COALESCE($6,profileImage),
  //       coverImage=COALESCE($7,coverImage)
  //     WHERE id=$1 RETURNING
  //     id,
  //     created_at,
  //     COALESCE(title, '') as title,
  //     COALESCE(description, '') as description,
  //     COALESCE(boards, ARRAY[]::text[]) AS boards,
  //     COALESCE(members, ARRAY[]::text[]) AS members,
  //     COALESCE(profileImage, '') as profileImage,
  //     COALESCE(coverImage, '') as coverImage
  //   `, [id, data.title, data.description, data.members, data.boards, data.profileImage, data.coverImage])

  //   // eslint-disable-next-line
  //   return rows.map(({ created_at, ...workspace }) => ({
  //     ...workspace,
  //     // eslint-disable-next-line
  //     createdAt: created_at,
  //   }))[0]
  // }
}
