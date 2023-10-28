import { client } from '@/database'
import { ElementUpdate } from '@/protocols/use-cases/element-update'
import { HTTPPaginationAndOrderParams } from '@/protocols/models/http'
import { CreateElementUpdateModel, ElementUpdateModel } from '@/protocols/models/element-update'

export type PostgresElementUpdateModel = Omit<ElementUpdateModel, 'createdAt' | 'updatedAt'> & {
  created_at: string
  updated_at: string
}

const modelMapping = (elements: PostgresElementUpdateModel[]): ElementUpdateModel[] => {
  /* eslint-disable-next-line camelcase */
  return elements.map(({ created_at, updated_at, ...row }) => ({
    ...row,
    /* eslint-disable-next-line camelcase */
    createdAt: created_at,
    /* eslint-disable-next-line camelcase */
    updatedAt: updated_at,
  }))
}

export class PgElementUpdateRepository implements ElementUpdate {
  async create(props: CreateElementUpdateModel): Promise<ElementUpdateModel | undefined> {
    const { rows } = await client.query(`INSERT INTO element_upadtes(
      elementid,
      created_at,
      "user",
      content,
      attachments
    ) VALUES($1, CURRENT_TIMESTAMP , $2, $3, $4)
    RETURNING
      id,
      created_at,
      COALESCE(elementid, null) as elementid,
      COALESCE(updated_at, null) as updated_at,
      COALESCE(content, '') as content,
      COALESCE("user", '') as "user",
      COALESCE(attachments, ARRAY[]::text[]) AS attachments
    `, [
      props.elementId,
      props.user,
      props.content,
      props.attachments,
    ])

    return modelMapping(rows)[0]
  }

  async delete(id: string): Promise<boolean> {
    if (!id) return false

    const { rowCount } = await client.query('DELETE FROM element_upadtes WHERE id=$1', [id])
    return rowCount > 0
  }

  async getById(id: string): Promise<ElementUpdateModel | undefined> {
    const { rows } = await client.query('SELECT * FROM element_upadtes WHERE id=$1', [id])

    return modelMapping(rows)[0]
  }

  async getAll(params: HTTPPaginationAndOrderParams): Promise<ElementUpdateModel[]> {
    const { rows } = await client.query(`
      SELECT
        id,
        COALESCE(created_at, TIMESTAMP '1970-01-01 00:00:00') as created_at,
        COALESCE(updated_at, null) as updated_at,
        COALESCE(elementid, null) as elementid,
        COALESCE("user", '') as "user",
        COALESCE(content, '') as content,
        COALESCE(attachments, ARRAY[]::text[]) AS attachments
      FROM element_upadtes
      ORDER BY ${params.orderBy} ${params.order}
      LIMIT $1
      OFFSET $2::integer * $1::integer
    `, [params.limit, params.offset])

    return modelMapping(rows)
  }

  async setById(id: string, data: Partial<CreateElementUpdateModel>): Promise<ElementUpdateModel | undefined> {
    const { rows } = await client.query(`
      UPDATE element_upadtes
      SET
        content=COALESCE($2,content),
        "user"=COALESCE($3,"user"),
        attachments=COALESCE($4,attachments),
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$1
      RETURNING
        id,
        COALESCE(created_at, TIMESTAMP '1970-01-01 00:00:00') as created_at,
        COALESCE(updated_at, TIMESTAMP '1970-01-01 00:00:00') as updated_at,
        COALESCE(elementid, null) as elementid,
        COALESCE("user", '') as "user",
        COALESCE(content, '') as content,
        COALESCE(attachments, ARRAY[]::text[]) AS attachments
    `, [
      id,
      data.content,
      data.user,
      data.attachments,
    ])

    return modelMapping(rows)[0]
  }
}
