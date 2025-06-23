import pgPromise from 'pg-promise'
import dotenv from 'dotenv'
dotenv.config({ path: '.env'})
const pgp = pgPromise()
<<<<<<< HEAD:server/model/database_integretion.ts
console.log({
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGHOST: process.env.PGHOST,
  PGPORT: process.env.PGPORT,
  PGDATABASE: process.env.PGDATABASE
})

const db = pgp(`${process.env.DATABASE_URL}`);
=======
const db = pgp(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`)
//cloud connection 
// const db = pgp(`${process.env.DATABASE_URL}`);
>>>>>>> f77662c2ecef8d03a7b9c45e85349418027e5629:server/db/database_integretion.ts
export default db;