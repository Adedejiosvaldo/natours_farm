const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const connectDB = require('../../db/connect');
const Tours = require('../../model/Tours');

const DB = process.env.DATABASE_URL.replace('<Password>', process.env.PASSWORD);
connectDB(DB);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMport Data into DB
const importData = async () => {
  try {
    await Tours.create(tours);
    console.log('Data success');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

const deleteAllData = async () => {
  try {
    await Tours.deleteMany();
    console.log('Data Deleted');
  } catch (error) {
    console.error(error.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllData();
}

console.log(process.argv);
