import 'dotenv/config'
import { Client } from 'pg'
import { env } from 'process'

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: env['POSTGRES_USER'],
  password: env['POSTGRES_PASSWORD'],
  database: env['POSTGRES_DB'],
})

client.connect()
