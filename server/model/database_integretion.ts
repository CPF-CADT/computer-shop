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
// const db = pgp(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`)
// export default db;

const db = pgp('postgresql://neondb_owner:npg_pfsibwg03hod@ep-hidden-sky-a1sq10j0-pooler.ap-southeast-1.aws.neon.tech/computer_shop?sslmode=require');
export default db;