import { client } from '@/database'
import { Element } from '@/protocols/use-cases/element'
import { HTTPPaginationAndOrderParams } from '@/protocols/models/http'
import { CreateElementModel, ElementModel } from '@/protocols/models/element'

export type PostgresElementModel = Omit<ElementModel, 'createdAt' | 'startDate' | 'expectedDate' | 'endDate'> & {
  created_at: string
  expected_date: string
  start_date: string
  end_date: string
}

const modelMapping = (elements: PostgresElementModel[]): ElementModel[] => {
  /* eslint-disable-next-line camelcase */
  return elements.map(({ created_at, start_date, expected_date, end_date, ...row }) => ({
    ...row,
    /* eslint-disable-next-line camelcase */
    createdAt: created_at,
    /* eslint-disable-next-line camelcase */
    startDate: start_date,
    /* eslint-disable-next-line camelcase */
    expectedDate: expected_date,
    /* eslint-disable-next-line camelcase */
    endDate: end_date,
  }))
}

export class PgElementRepository implements Element {
  async create(props: CreateElementModel): Promise<ElementModel | undefined> {
    const { rows } = await client.query(`INSERT INTO elements(
      title,
      created_at,
      group,
      members,
      status,
      expected_date,
      start_date,
      end_date,
      updates
    ) VALUES($1, CURRENT_TIMESTAMP , $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(group, '') as group,
      COALESCE(members, ARRAY[]::text[]) AS members,
      COALESCE(status, '') as status,
      COALESCE(expected_date, '') as expected_date,
      COALESCE(start_date, '') as start_date,
      COALESCE(end_date, '') as end_date,
      COALESCE(updates, ARRAY[]::text[]) AS updates
    `, [
      props.title,
      props.group,
      props.members,
      props.status,
      props.expectedDate,
      props.startDate,
      props.endDate,
      props.updates,
    ])

    return modelMapping(rows)[0]
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false

    const { rowCount } = await client.query('DELETE FROM elements WHERE id=$1', [id])
    return rowCount > 0
  }

  async getById(id: string): Promise<ElementModel | undefined> {
    const { rows } = await client.query('SELECT * FROM elements WHERE id=$1', [id])

    return modelMapping(rows)[0]
  }

  async getAll(params: HTTPPaginationAndOrderParams): Promise<ElementModel[]> {
    const { rows } = await client.query(`
      SELECT
      id,
      created_at,
      COALESCE(title, '') as title,
      COALESCE(group, '') as group,
      COALESCE(members, ARRAY[]::text[]) AS members,
      COALESCE(status, '') as status,
      COALESCE(expected_date, '') as expected_date,
      COALESCE(start_date, '') as start_date,
      COALESCE(end_date, '') as end_date,
      COALESCE(updates, ARRAY[]::text[]) AS updates
      FROM elements
      ORDER BY ${params.orderBy} ${params.order}
      LIMIT $1
      OFFSET $2::integer * $1::integer
    `, [params.limit, params.offset])

    return modelMapping(rows)
  }

  async setById(id: string, data: Partial<CreateElementModel>): Promise<ElementModel | undefined> {
    const { rows } = await client.query(`
      UPDATE elements
      SET
        title=COALESCE($2,title),
        group=COALESCE($3,group),
        members=COALESCE($4,members),
        status=COALESCE($5,status),
        expected_date=COALESCE($6,expected_date),
        start_date=COALESCE($7,start_date),
        end_date=COALESCE($8,end_date),
        updates=COALESCE($9,updatese)
      WHERE id=$1
      RETURNING
        id,
        created_at,
        COALESCE(title, '') as title,
        COALESCE(group, '') as group,
        COALESCE(members, ARRAY[]::text[]) AS members,
        COALESCE(status, '') as status,
        COALESCE(expected_date, '') as expected_date,
        COALESCE(start_date, '') as start_date,
        COALESCE(end_date, '') as end_date,
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

    return modelMapping(rows)[0]
  }
}
