import 'dotenv/config'
import { Client } from 'pg'
import { env } from 'process'

export const client = new Client({
  host: 'localhost',
  port: Number(env['POSTGRES_PORT']),
  user: env['POSTGRES_USER'],
  password: env['POSTGRES_PASSWORD'],
  database: env['POSTGRES_DB'],
})

// client.connect()
// client.query('INSERT INTO accounts(name, email, password) VALUES($1, $2, $3)', ['Jhoni', 'edicao@microsite.net.br', '123456']).then(result => console.log('db', result.rows))
// client.query('DELETE FROM accounts').then(result => console.log(result.rows))
