const dotenv = require('dotenv');

const app = require('./app');
const connectDB = require('./db/connect');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE_URL.replace('<Password>', process.env.PASSWORD);

connectDB(DB);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Running on ${port}`);
});
