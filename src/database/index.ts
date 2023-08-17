import { Client } from 'pg'
import { env } from 'process'
import fs from 'fs'
import path from 'path'

const sqlQueries = fs.readFileSync(path.resolve('./src/database/schema.sql'), 'utf-8').split(';')

async function checkDatabaseTables() {
  try {
    for (const query of sqlQueries) {
      if (query.trim()) {
        await client.query(query)
      }
    }
  } catch { }
}

export const client = new Client({
  host: 'localhost',
  port: Number(env.POSTGRES_PORT),
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
})

client.connect()

checkDatabaseTables()
