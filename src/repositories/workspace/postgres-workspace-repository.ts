import { client } from '@/database'
import { Workspace } from '@/protocols/use-cases/workspace'
import { HTTPRequestParams } from '@/protocols/models/http'
import { CreateWorkspaceModel, UpdateWorkspaceModel, WorkspaceModel } from '@/protocols/models/workspace'

type PostgresWorkspaceModel = Omit<WorkspaceModel, 'createdAt' | 'profileImage' | 'coverImage'> & {
  created_at: string
  profileimage: string
  coverimage: string
}
export class PgWorkspaceReposytory implements Workspace {
  /* eslint-disable camelcase */
  private convertPgWorkspaceIntoWorkspace = (elements: PostgresWorkspaceModel[]): WorkspaceModel[] => {
    return elements.map(({
      id = '',
      created_at = '',
      title = '',
      description = '',
      boards = [],
      members = [],
      profileimage = '',
      coverimage = '',
    }) => ({
      id,
      createdAt: created_at || '',
      title,
      description,
      boards,
      members,
      profileImage: profileimage,
      coverImage: coverimage,
    }))
  }

  async create(workspace: CreateWorkspaceModel): Promise<WorkspaceModel> {
    const { rows } = await client.query(`INSERT INTO workspaces(
      title,
      created_at,
      description,
      boards,
      members,
      profileimage,
      coverimage
    ) VALUES($1, CURRENT_TIMESTAMP , $2, $3, $4, $5, $6) RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(description, '') as description,
      COALESCE(boards, ARRAY[]::text[]) AS boards,
      COALESCE(members, ARRAY[]::text[]) AS members,
      COALESCE(profileimage, '') as profileimage,
      COALESCE(coverimage, '') as coverimage
    `, [
      workspace.title,
      workspace.description,
      workspace.boards,
      workspace.members,
      workspace.profileImage,
      workspace.coverImage,
    ])

    return this.convertPgWorkspaceIntoWorkspace(rows)[0]
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

    return this.convertPgWorkspaceIntoWorkspace(rows)
  }

  async getById(id: string): Promise<WorkspaceModel | undefined> {
    const { rows } = await client.query('SELECT * FROM workspaces WHERE id=$1', [id])

    return this.convertPgWorkspaceIntoWorkspace(rows)[0]
  }

  async setById(id: string, data: UpdateWorkspaceModel): Promise<WorkspaceModel> {
    const { rows } = await client.query(`
      UPDATE workspaces
      SET
        title=COALESCE($2,title),
        description=COALESCE($3,description),
        members=COALESCE($4,members),
        boards=COALESCE($5,boards),
        profileimage=COALESCE($6,profileimage),
        coverimage=COALESCE($7,coverimage)
      WHERE id=$1 RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(description, '') as description,
      COALESCE(boards, ARRAY[]::text[]) AS boards,
      COALESCE(members, ARRAY[]::text[]) AS members,
      COALESCE(profileimage, '') as profileimage,
      COALESCE(coverimage, '') as coverimage
    `, [id, data.title, data.description, data.members, data.boards, data.profileImage, data.coverImage])

    return this.convertPgWorkspaceIntoWorkspace(rows)[0]
  }
}
