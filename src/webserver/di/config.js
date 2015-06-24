export default {
  webserver: {
    publicDir: process.env.PUBLIC_DIR,
    host: process.env.IP || '0.0.0.0',
    port: process.env.PORT || '3000'
  }
}
