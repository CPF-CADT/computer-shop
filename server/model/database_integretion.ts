import pgPromise from 'pg-promise'
import dotenv from 'dotenv'
dotenv.config({ path: '.env'})
const pgp = pgPromise()
console.log({
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGHOST: process.env.PGHOST,
  PGPORT: process.env.PGPORT,
  PGDATABASE: process.env.PGDATABASE
})

const db = pgp(`${process.env.DATABASE_URL}`);
export default db;