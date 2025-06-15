import pgPromise from 'pg-promise'
import dotenv from 'dotenv'
dotenv.config({ path: '.env'})
const pgp = pgPromise()
const db = pgp(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`)
//cloud connection 
// const db = pgp(`${process.env.DATABASE_URL}`);
export default db;