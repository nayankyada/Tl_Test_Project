const express = require('express');
const bodyParser = require('body-parser')
const app = express()
const deleteuser = require('./routes/deleteuser')
const cors = require('cors');

const corsOption = {
    origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));
// It parse body of each request
app.use(bodyParser.urlencoded({extended:false}));

app.use('/deleteUser',deleteuser)
app.use('/',(req,res,next) => {
  res.status(404).send("<h1>Page Not Found</h1>")
});
app.listen(4000)