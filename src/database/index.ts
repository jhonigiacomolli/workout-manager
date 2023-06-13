import { Client } from 'pg'
import { env } from 'process'

export const client = new Client({
  host: 'localhost',
  port: Number(env.POSTGRES_PORT),
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
})

client.connect()
