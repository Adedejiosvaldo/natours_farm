const dotenv = require('dotenv');

const app = require('./app');
const connectDB = require('./db/connect');

process.on('uncaughtException', (err) => {
  console.log('Shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace('<Password>', process.env.PASSWORD);

connectDB(DB);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Running on ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
