import { client } from '@/database'
import { TeamModel } from '@/protocols/models/team'
import { HTTPPaginationAndOrderParams } from '@/protocols/models/http'
import { CreateTeamParams, Team, UpdateTeamParams } from '@/protocols/use-cases/team'

type PostgresTeamModel = Omit<TeamModel, 'createdAt'> & {
  created_at: string
}

export class PgTeamRepository implements Team {
  /* eslint-disable camelcase */
  private convertPgTeamIntoTeam = (elements: PostgresTeamModel[]): TeamModel[] => {
    return elements.map(({
      id = '',
      name = '',
      created_at = '',
      members = [],
    }) => ({
      id,
      createdAt: created_at,
      name,
      members,
    }))
  }

  async create(props: CreateTeamParams): Promise<TeamModel> {
    const { rows } = await client.query(`INSERT INTO teams(
      name,
      created_at,
      members
    ) VALUES($1, CURRENT_TIMESTAMP , $2) RETURNING
      id,
      created_at,
      COALESCE(name, '') as name,
      COALESCE(members, ARRAY[]::text[]) AS members
    `, [
      props.name,
      props.members,
    ])

    return this.convertPgTeamIntoTeam(rows)[0]
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false

    const { rowCount } = await client.query('DELETE FROM teams WHERE id=$1', [id])
    return rowCount > 0
  }

  async getTeamByID(id: string): Promise<TeamModel | undefined> {
    const { rows } = await client.query('SELECT * FROM teams WHERE id=$1', [id])

    return this.convertPgTeamIntoTeam(rows)[0]
  }

  async getAllTeams(params: HTTPPaginationAndOrderParams): Promise<TeamModel[]> {
    const { rows } = await client.query(`
        SELECT
        id,
        name,
        created_at,
        COALESCE(members, ARRAY[]::text[]) AS members
        FROM teams
        ORDER BY ${params.orderBy} ${params.order}
        LIMIT $1
        OFFSET $2::integer * $1::integer
      `, [params.limit, params.offset])

    return this.convertPgTeamIntoTeam(rows)
  }

  async setTeamByID(id: string, data: UpdateTeamParams): Promise<TeamModel | undefined> {
    const { rows } = await client.query(`
      UPDATE teams
      SET
        name=COALESCE($2,name),
        members=COALESCE($3,members)
      WHERE id=$1 RETURNING
      id,
      created_at,
      COALESCE(name, '') as name,
      COALESCE(members, ARRAY[]::text[]) AS members
    `, [id, data.name, data.members])

    return this.convertPgTeamIntoTeam(rows)[0]
  }
}
