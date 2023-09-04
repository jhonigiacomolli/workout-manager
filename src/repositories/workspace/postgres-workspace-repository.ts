import { client } from '@/database'
import { Workspace } from '@/protocols/use-cases/workspace'
import { CreateWorkspaceModel, UpdateWorkspaceModel, WorkspaceModel } from '@/protocols/models/workspace'
import { HTTPRequestParams } from '@/protocols/models/http'

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
    const { rows } = await client.query('SELECT * FROM workspaces WHERE id=$1', [id])

    return {
      id: rows[0].id,
      createdAt: rows[0].created_at,
      title: rows[0].title,
      description: rows[0].description,
      boards: rows[0].boards,
      members: rows[0].members,
      coverImage: rows[0].coverImage,
      profileImage: rows[0].profileImage,
    }
  }

  async setById(id: string, data: UpdateWorkspaceModel): Promise<WorkspaceModel> {
    const { rows, rowCount } = await client.query(`
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

    console.log('Rows: ', rowCount)
    // eslint-disable-next-line
    return rows.map(({ created_at, ...workspace }) => ({
      ...workspace,
      // eslint-disable-next-line
      createdAt: created_at,
    }))[0]
  }
}
