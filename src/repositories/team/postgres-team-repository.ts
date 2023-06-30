import { client } from '@/database'
import { HTTPPaginationAndOrderParams } from '@/protocols/models/http'
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

  async getAllTeams(params: HTTPPaginationAndOrderParams): Promise<TeamModel[]> {
    try {
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

      return rows.map(row => ({
        id: row.id,
        createdAt: row.created_at,
        name: row.name,
        members: row.members,
      }))
    } catch (errr) {
      console.log('Error: ', errr)
      return []
    }
  }
}
