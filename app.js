const express = require('express');
const app = express();
const tasks = require('./routes/tasks');
const connectDB = require('./db/connect');
require('dotenv').config()
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

//middlewware to allow us parse json data
app.use(express.json());

app.use(express.static('./public'))

app.use(errorHandler)

app.use('/api/v1/tasks', tasks)

app.use(notFound);

const port = process.env.PORT || 3000;

const start = async () => {

  try {

    await connectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`server is running on port ${port}...`));
    
  } catch (error) {
    console.log(error);
  }
}

start()
