import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import configDB from './config/database';
import routes from './route/index';
require('dotenv').config();


// configuration ===============================================================
if (process.env.NODE_ENV !== 'production') {
  mongoose.connect(configDB.url, { useMongoClient: true }); // connect to our database  
} else {
  mongoose.connect(configDB.url_production,{ useMongoClient: true }); // connect to our database
}


const app = express();
const port = process.env.PORT || 3002;
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api/v1', routes);

app.get('/', (req, res)=> {
  res.send('hello there!!')
}).listen(port, ()=> {
  console.log(`Server is running on ${port}`)
})