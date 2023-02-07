const Web1PageSession = require('../models/web1PageSession');
const getID = require("../middleware/generateID");

exports.Web1PageSession_post = function(req,res){
    if (req.body.expectedSessionTime1PS<5 || req.body.expectedSessionTime1PS > 100){
            return res.status(400).json({
                message: 'Expected Maximum Session Time should be between 5 to 100'
            }); //Bad Request
        }else{
            var Max= req.body.expectedSessionTime1PS, // expectedSessionTime2PS
            SessionTime = req.body.sessionTime1PS; //sessionTime2PS
            
            var Min = 0.005*Max+0.24;
            
            var MOS = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;    
        }
    (new Web1PageSession({'username': req.params.username , 'expectedSessionTime1PS': req.body.expectedSessionTime1PS,
    'sessionTime1PS':req.body.sessionTime1PS,
    'idW1PS':getID(), 'mosW1PS':MOS }))
    .save()
    .then(function(){
        res.status(200).json({
            MOS: MOS
        });
    }).catch(error => {console.log(error)});
};

exports.Web1PageSessionExpectedSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.expectedSessionTime1PS.length - 1); i++) {
        if (req.body.expectedSessionTime1PS[i]<5 || req.body.expectedSessionTime1PS[i] > 100){
            return res.status(400).json({
                message: 'Expected Maximum Session Time should be between 5 to 100'
            }); //Bad Request
        }else{
            var Max= req.body.expectedSessionTime1PS[i], // expectedSessionTime2PS
            SessionTime = req.body.sessionTime1PS; //sessionTime2PS
            
            var Min = 0.005*Max+0.24;
            
            MOS[i] = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;    
        }
    }
    (new Web1PageSession({'username': req.params.username , 'expectedSessionTime1PS': req.body.expectedSessionTime1PS,
    'sessionTime1PS':req.body.sessionTime1PS,
    'idW1PS':getID(), 'mosW1PS':MOS }))
    .save()
    .then(function(web1PageSession){
        res.send(web1PageSession);
    }).catch(error => {console.log(error)});
};

exports.Web1PageSessionSessionSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.sessionTime1PS.length - 1); i++) {
        if (req.body.expectedSessionTime1PS<5 || req.body.expectedSessionTime1PS > 100){
            return res.status(400).json({
                message: 'Expected Maximum Session Time should be between 5 to 100'
            }); //Bad Request
        }else{
            var Max= req.body.expectedSessionTime1PS, // expectedSessionTime2PS
            SessionTime = req.body.sessionTime1PS[i]; //sessionTime2PS
            
            var Min = 0.005*Max+0.24;
            
            MOS[i] = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;    
        }
    }
    (new Web1PageSession({'username': req.params.username , 'expectedSessionTime1PS': req.body.expectedSessionTime1PS,
    'sessionTime1PS':req.body.sessionTime1PS,
    'idW1PS':getID(), 'mosW1PS':MOS }))
    .save()
    .then(function(web1PageSession){
        res.send(web1PageSession);
    }).catch(error => {console.log(error)});
};