import { client } from '@/database'
import { HTTPRequestParams } from '@/protocols/models/http'
import { TeamModel } from '@/protocols/models/team'
import { Team } from '@/protocols/use-cases/team'

export class PgTeamRepository implements Team {
  async getTeamByID(id: string): Promise<TeamModel | undefined> {
    try {
      const { rows } = await client.query('SELECT * FROM teams WHERE id=$1', [id])

      return rows[0]
    } catch {
      return undefined
    }
  }

  async getAllTeams(params: HTTPRequestParams): Promise<TeamModel[]> {
    try {
      const { rows } = await client.query(`
      SELECT
      id,
      name,
      COALESCE(members, ARRAY[]::text[]) AS members
      FROM teams LIMIT $1`, [params.limit])

      return rows
    } catch {
      return []
    }
  }
}
