const express = require('express');
const app = express();                           //set up express app
const bodyParser = require('body-parser');
const mongoose = require('mongoose');            //connect to database
const morgan = require('morgan');
var cors = require('cors')                       //for the front-end to connect to the server
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
 next();
});
//connect mongoose
mongoose.connect("mongodb+srv://duytruong:tatcadahet169@cluster0-kzgfb.mongodb.net/Image-storing-app?retryWrites=true&w=majority",{useCreateIndex: true, useNewUrlParser: true }, (err)=>{
    if(err){
      console.log('error');
          }
    else {
        console.log('you are connected to the Mongoose database server')
         }
});
mongoose.Promise= global.Promise;
app.use(morgan('dev'));                          //morgan middleware 'for displaying the requests'
app.use(cors());                                 //cors middleware
app.use(bodyParser.json({limit: 50 * 1024 * 1024}));
app.use(bodyParser.urlencoded({limit: 50 * 1024 * 1024, extended: true}));                     //bodypaser middleware
app.use(express.static(__dirname + '/public'));

app.use('/api', require('./routes/userapi'));   //Initialize routes
app.use('/api', require('./routes/post-api'));     //Initialize routes
app.use('/uploads',express.static('uploads'));

//listening for requests
//const PORT = process.env.PORT || 3000 ;
//app.listen(process.env.PORT ||3000, () => console.log(`Server started on PORT ${PORT}`));
module.exports = app;
