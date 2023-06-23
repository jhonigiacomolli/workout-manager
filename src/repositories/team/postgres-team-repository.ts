import { client } from '@/database'
import { TeamModel } from '@/protocols/models/team'
import { Team } from '@/protocols/use-cases/team'

export class PgTeamRepository implements Team {
  async getTeamByID(id: string): Promise<TeamModel | undefined> {
    const { rows } = await client.query('SELECT * FROM teams WHERE id=$1', [id])

    return rows[0]
  }
}
