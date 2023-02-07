const Web2PageSession = require('../models/web2PageSession');
const getID = require("../middleware/generateID");

exports.Web2PageSession_post = function(req,res){
    if (req.body.expectedSessionTime2PS < 10 || req.body.expectedSessionTime2PS>200 ){
        return res.status(400).json({
            message: 'Expected Maximum Session Time should be between 10 to 200'
        }); //Bad Request
    }else{
        var Max= req.body.expectedSessionTime2PS, // expectedSessionTime2PS
        SessionTime = req.body.sessionTime2PS; //sessionTime2PS
    
        var Min = 0.011*Max + 0.47;
    
        var MOS = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;
    }         
    (new Web2PageSession({'username': req.params.username , 'expectedSessionTime2PS': req.body.expectedSessionTime2PS,
    'sessionTime2PS':req.body.sessionTime2PS,
    'idW2PS':getID(), 'mosW2PS':MOS }))
    .save()
    .then(function(){
        if (MOS > 5){
            MOS = 4.96;
        }
        res.status(200).json({
            MOS: MOS
        });
    }).catch(error => {console.log(error)});
};

exports.Web2PageSessionExpectedSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.expectedSessionTime2PS.length - 1); i++) {
        if (req.body.expectedSessionTime2PS[i] < 10 || req.body.expectedSessionTime2PS[i]>200 ){
            return res.status(400).json({
                message: 'Expected Maximum Session Time should be between 10 to 200'
            }); //Bad Request
        }else{
            var Max= req.body.expectedSessionTime2PS, // expectedSessionTime2PS
            SessionTime = req.body.sessionTime2PS; //sessionTime2PS
        
            var Min = 0.011*Max[i] + 0.47;
        
            MOS[i] = (4/(Math.log(Min/Max[i])))*(Math.log(SessionTime)-Math.log(Min)) + 5;
        }       
    } 
    (new Web2PageSession({'username': req.params.username , 'expectedSessionTime2PS': req.body.expectedSessionTime2PS,
    'sessionTime2PS':req.body.sessionTime2PS,
    'idW2PS':getID(), 'mosW2PS':MOS }))
    .save()
    .then(function(web2PageSession){
        res.send(web2PageSession);
    }).catch(error => {console.log(error)});
};

exports.Web2PageSessionSessionSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.sessionTime2PS.length - 1); i++) {
        if (req.body.expectedSessionTime2PS < 10 || req.body.expectedSessionTime2PS>200 ){
            return res.status(400).json({
                message: 'Expected Maximum Session Time should be between 10 to 200'
            }); //Bad Request
        }else{
            var Max= req.body.expectedSessionTime2PS, // expectedSessionTime2PS
            SessionTime = req.body.sessionTime2PS; //sessionTime2PS
        
            var Min = 0.011*Max + 0.47;
        
            MOS[i] = (4/(Math.log(Min/Max)))*(Math.log(SessionTime[i])-Math.log(Min)) + 5;
        }       
    } 
    (new Web2PageSession({'username': req.params.username , 'expectedSessionTime2PS': req.body.expectedSessionTime2PS,
    'sessionTime2PS':req.body.sessionTime2PS,
    'idW2PS':getID(), 'mosW2PS':MOS }))
    .save()
    .then(function(web2PageSession){
        res.send(web2PageSession);
    }).catch(error => {console.log(error)});
};