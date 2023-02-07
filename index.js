const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

//Setting up express application whic listens for request
const app = express();

//Used to log requests
const morgan = require('morgan');
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));

// Cross Origin Request Security
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE"); // allow these method to access API
        return res.status(200).json({});
    }
    next();
});

//Connection to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/MappingTool')
.then(() => console.log("Database is connected"))
.catch((error) => console.log(error));

//app.use(bodyParser.json()); // allow application to use json data
app.use(express.json()); // allow application to use json data

// Initalise routes
app.use('/api', require('./routes/usersAPI')); // Use the routes to navigate from api.js
app.use('/api', require('./routes/gamingAPI')); 
app.use('/api', require('./routes/audioStreamingHRAPI')); 
app.use('/api', require('./routes/audioStreamingLRAPI')); 
app.use('/api', require('./routes/eModelFullbandAPI')); 
app.use('/api', require('./routes/eModelWidebandAPI')); 
app.use('/api', require('./routes/eModelNarrowbandAPI')); 
app.use('/api', require('./routes/videoStreamingHRAPI'));
app.use('/api', require('./routes/videoStreamingLRAPI'));
app.use('/api', require('./routes/videoTelephonyAPI'));
app.use('/api', require('./routes/voiceTelephonyNBAPI'));
app.use('/api', require('./routes/voiceTelephonyWBAPI'));
app.use('/api', require('./routes/web1PageSessionAPI'));
app.use('/api', require('./routes/web2PageSessionAPI'));
app.use('/api', require('./routes/webSingleTimingEventAPI'));
//Testing
app.use((req,res,next) => {
    const error = new Error('API Not Found');
    error.status= 404;
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
//Listens for request
//app.listen(3000,function(){
    //console.log('Server is connected on port 3000! Listening for requests');
//});