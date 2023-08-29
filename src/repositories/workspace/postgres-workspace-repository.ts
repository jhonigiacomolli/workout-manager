import { client } from '@/database'
import { Workspace } from '@/protocols/use-cases/workspace'
import { CreateWorkspaceModel, WorkspaceModel } from '@/protocols/models/workspace'

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
}
