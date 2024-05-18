import pgPromise from 'pg-promise';

const pgp = pgPromise();
const isProduction = process.env.NODE_ENV === 'production';
console.log(process.env.DB_HOST)
const db = pgp({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
export default db;

