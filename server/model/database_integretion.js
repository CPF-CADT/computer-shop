"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_promise_1 = __importDefault(require("pg-promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const pgp = (0, pg_promise_1.default)();
console.log({
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGHOST: process.env.PGHOST,
    PGPORT: process.env.PGPORT,
    PGDATABASE: process.env.PGDATABASE
});
// const db = pgp(`postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`)
// export default db;
const db = pgp('postgresql://neondb_owner:npg_pfsibwg03hod@ep-hidden-sky-a1sq10j0-pooler.ap-southeast-1.aws.neon.tech/computer_shop?sslmode=require');
exports.default = db;
