const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');
const connectDB = require('./db/connect');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_URL.replace('<Password>', process.env.PASSWORD);

connectDB(DB);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Running on ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
 