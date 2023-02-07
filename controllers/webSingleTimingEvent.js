const WebSingleTimingEvent = require('../models/webSingleTimingEvent');
const getID = require("../middleware/generateID");

exports.WebSingleTimingEvent_post = function(req,res){
    if (req.body.expectedSessionTimeSTE<3 || req.body.expectedSessionTimeSTE>50) {
        return res.status(400).json({
            message: 'Expected Maximum Session Time should be between 3 to 50'
        }); //Bad Request
    }else{
        var Max= req.body.expectedSessionTimeSTE, // expectedSessionTime2PS
        SessionTime = req.body.sessionTimeSTE; //sessionTime2PS
    
        var Min = 0.003*Max+0.12;
    
        var MOS = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;

        (new WebSingleTimingEvent({'username': req.params.username , 'expectedSessionTimeSTE': req.body.expectedSessionTimeSTE,
        'sessionTimeSTE':req.body.sessionTimeSTE,
        'idWSTE':getID(), 'mosWSTE':MOS }))
        .save()
        .then(function(){
            res.status(200).json({
                MOS: MOS
            });
    }).catch(error => {console.log(error)});
    }
};

exports.WebSingleTimingEventExpectedSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.expectedSessionTimeSTE.length - 1); i++) {
        if (req.body.expectedSessionTimeSTE[i] <3 || req.body.expectedSessionTimeSTE[i]>50) {
            return res.status(400).json({
                message: 'Expected Maximum Session Time should be between 3 to 50'
            }); //Bad Request
        }else{
            var Max= req.body.expectedSessionTimeSTE, // expectedSessionTime2PS
            SessionTime = req.body.sessionTimeSTE; //sessionTime2PS
            
            var Min = 0.003*Max[i]+0.12;
            MOS[i] = (4/(Math.log(Min/Max[i])))*(Math.log(SessionTime)-Math.log(Min)) + 5;
        }    
    }
    (new WebSingleTimingEvent({'username': req.params.username , 'expectedSessionTimeSTE': req.body.expectedSessionTimeSTE,
            'sessionTimeSTE':req.body.sessionTimeSTE,
            'idWSTE':getID(), 'mosWSTE':MOS }))
            .save()
            .then(function(webSingleTimingEvent){
            res.send(webSingleTimingEvent);
            }).catch(error => {console.log(error)});
};

exports.WebSingleTimingEventSessionSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.sessionTimeSTE.length - 1); i++) {
        if (req.body.expectedSessionTimeSTE <3 || req.body.expectedSessionTimeSTE>50) {
            return res.status(400).json({
                message: 'Expected Maximum Session Time should be between 3 to 50'
            }); //Bad Request
        }else{
            var Max= req.body.expectedSessionTimeSTE, // expectedSessionTime2PS
            SessionTime = req.body.sessionTimeSTE; //sessionTime2PS
            
            var Min = 0.003*Max+0.12;
            MOS[i] = (4/(Math.log(Min/Max)))*(Math.log(SessionTime[i])-Math.log(Min)) + 5;
        }    
    }
    (new WebSingleTimingEvent({'username': req.params.username , 'expectedSessionTimeSTE': req.body.expectedSessionTimeSTE,
            'sessionTimeSTE':req.body.sessionTimeSTE,
            'idWSTE':getID(), 'mosWSTE':MOS }))
            .save()
            .then(function(webSingleTimingEvent){
            res.send(webSingleTimingEvent);
            }).catch(error => {console.log(error)});
};