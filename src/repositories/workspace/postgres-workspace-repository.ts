import { client } from '@/database'
import { Workspace } from '@/protocols/use-cases/workspace'
import { HTTPRequestParams } from '@/protocols/models/http'
import { CreateWorkspaceModel, UpdateWorkspaceModel, WorkspaceModel } from '@/protocols/models/workspace'

export class PgWorkspaceReposytory implements Workspace {
  async create(workspace: CreateWorkspaceModel): Promise<WorkspaceModel> {
    const { rows } = await client.query(`INSERT INTO workspaces(
      title,
      created_at,
      description,
      boards,
      members,
      profileImage,
      coverImage
    ) VALUES($1, CURRENT_TIMESTAMP , $2, $3, $4, $5, $6) RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(description, '') as description,
      COALESCE(boards, ARRAY[]::text[]) AS boards,
      COALESCE(members, ARRAY[]::text[]) AS members,
      COALESCE(profileImage, '') as profileImage,
      COALESCE(coverImage, '') as coverImage
    `, [
      workspace.title,
      workspace.description,
      workspace.boards,
      workspace.members,
      workspace.profileImage,
      workspace.coverImage,
    ])

    // eslint-disable-next-line
    return rows.map(({ created_at, ...workspace }) => ({
      ...workspace,
      // eslint-disable-next-line
      createdAt: created_at,
    }))[0]
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false

    const { rowCount } = await client.query('DELETE FROM workspaces WHERE id=$1', [id])
    return rowCount > 0
  }

  async getAll(params: HTTPRequestParams): Promise<WorkspaceModel[]> {
    if (params.orderBy === 'createdAt') {
      params.orderBy = 'created_at'
    }

    const { rows } = await client.query(`
      SELECT * FROM workspaces
      ORDER BY ${params.orderBy} ${params.order}
      LIMIT $1
      OFFSET $2:: integer * $1:: integer;
    `, [params.limit, params.offset])
    return rows
  }

  async getById(id: string): Promise<WorkspaceModel | undefined> {
    try {
      const { rows } = await client.query('SELECT * FROM workspaces WHERE id=$1', [id])

      // eslint-disable-next-line camelcase
      return rows.map(({ created_at, title, description, boards, members, coverImage, profileImage }) => ({
        id,
        // eslint-disable-next-line camelcase
        createdAt: created_at,
        title,
        description,
        boards,
        members,
        coverImage,
        profileImage,
      }))[0]
    } catch (error) {
      if (error.code === '22P02') {
        return undefined
      } else {
        throw error
      }
    }
  }

  async setById(id: string, data: UpdateWorkspaceModel): Promise<WorkspaceModel> {
    const { rows } = await client.query(`
      UPDATE workspaces
      SET
        title=COALESCE($2,title),
        description=COALESCE($3,description),
        members=COALESCE($4,members),
        boards=COALESCE($5,boards),
        profileImage=COALESCE($6,profileImage),
        coverImage=COALESCE($7,coverImage)
      WHERE id=$1 RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(description, '') as description,
      COALESCE(boards, ARRAY[]::text[]) AS boards,
      COALESCE(members, ARRAY[]::text[]) AS members,
      COALESCE(profileImage, '') as profileImage,
      COALESCE(coverImage, '') as coverImage
    `, [id, data.title, data.description, data.members, data.boards, data.profileImage, data.coverImage])

    // eslint-disable-next-line
    return rows.map(({ created_at, ...workspace }) => ({
      ...workspace,
      // eslint-disable-next-line
      createdAt: created_at,
    }))[0]
  }
}
