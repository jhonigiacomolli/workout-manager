import { client } from '@/database'
import { Element } from '@/protocols/use-cases/element'
import { HTTPPaginationAndOrderParams } from '@/protocols/models/http'
import { CreateElementModel, ElementModel, UpdateElementModel } from '@/protocols/models/element'

export type PostgresElementModel = Omit<ElementModel, 'createdAt' | 'startDate' | 'expectedDate' | 'endDate'> & {
  created_at: string | null
  expected_date: string | null
  start_date: string | null
  end_date: string | null
}

export class PgElementRepository implements Element {
  /* eslint-disable camelcase */
  private convertPgElementIntoElement = (elements: PostgresElementModel[]): ElementModel[] => {
    return elements.map(({
      id = '',
      group = '',
      title = '',
      created_at = '',
      start_date = '',
      expected_date = '',
      end_date = '',
      members = [],
      status = 'waiting',
      updates = [],
    }) => ({
      id,
      group,
      title,
      createdAt: created_at || '',
      startDate: start_date || '',
      expectedDate: expected_date || '',
      endDate: end_date || '',
      members,
      status,
      updates,
    }))
  }

  async create(props: CreateElementModel): Promise<ElementModel | undefined> {
    const { rows } = await client.query(`INSERT INTO elements(
      title,
      created_at,
      "group",
      members,
      status,
      updates
    ) VALUES($1, CURRENT_TIMESTAMP , $2, $3, $4, $5)
    RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE("group", '') as "group",
      COALESCE(members, ARRAY[]::text[]) AS members,
      COALESCE(status, '') as status,
      COALESCE(expected_date, null) as expected_date,
      COALESCE(start_date, null) as start_date,
      COALESCE(end_date, null) as end_date,
      COALESCE(updates, ARRAY[]::text[]) AS updates
    `, [
      props.title,
      props.group,
      props.members,
      props.status,
      props.updates,
    ])

    return this.convertPgElementIntoElement(rows)[0]
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false

    const { rowCount } = await client.query('DELETE FROM elements WHERE id=$1', [id])
    return rowCount > 0
  }

  async getById(id: string): Promise<ElementModel | undefined> {
    const { rows } = await client.query('SELECT * FROM elements WHERE id=$1', [id])

    return this.convertPgElementIntoElement(rows)[0]
  }

  async getAll(params: HTTPPaginationAndOrderParams): Promise<ElementModel[]> {
    const { rows } = await client.query(`
      SELECT
        id,
        COALESCE(created_at, null) as created_at,
        COALESCE(title, '') as title,
        COALESCE("group", '') as "group",
        COALESCE(members, ARRAY[]::text[]) AS members,
        COALESCE(status, '') as status,
        COALESCE(expected_date, null) as expected_date,
        COALESCE(start_date, null) as start_date,
        COALESCE(end_date, null) as end_date,
        COALESCE(updates, ARRAY[]::text[]) AS updates
      FROM elements
      ORDER BY ${params.orderBy} ${params.order}
      LIMIT $1
      OFFSET $2::integer * $1::integer
    `, [params.limit, params.offset])

    return this.convertPgElementIntoElement(rows)
  }

  async setById(id: string, data: Partial<UpdateElementModel>): Promise<ElementModel | undefined> {
    const { rows } = await client.query(`
      UPDATE elements
      SET
        title=COALESCE($2,title),
        "group"=COALESCE($3,"group"),
        members=COALESCE($4,members),
        status=COALESCE($5,status),
        expected_date=COALESCE($6,expected_date),
        start_date=COALESCE($7,start_date),
        end_date=COALESCE($8,end_date),
        updates=COALESCE($9,updates)
      WHERE id=$1
      RETURNING
        id,
        COALESCE(created_at, TIMESTAMP '1970-01-01 00:00:00') as created_at,
        COALESCE(title, '') as title,
        COALESCE("group", '') as "group",
        COALESCE(members, ARRAY[]::text[]) AS members,
        COALESCE(status, '') as status,
        COALESCE(expected_date, null) as expected_date,
        COALESCE(start_date, null) as start_date,
        COALESCE(end_date, null) as end_date,
        COALESCE(updates, ARRAY[]::text[]) AS updates
    `, [
      id,
      data.title,
      data.group,
      data.members,
      data.status,
      data.expectedDate,
      data.startDate,
      data.endDate,
      data.updates,
    ])

    return this.convertPgElementIntoElement(rows)[0]
  }
}
