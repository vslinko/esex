export default {
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '2424',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD,
    dbname: process.env.DATABASE_DBNAME,
    dbuser: process.env.DATABASE_DBUSER,
    dbpassword: process.env.DATABASE_DBPASSWORD
  },
  webserver: {
    publicDir: process.env.PUBLIC_DIR,
    host: process.env.IP || '0.0.0.0',
    port: process.env.PORT || '3000'
  }
}
