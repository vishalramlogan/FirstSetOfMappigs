const AudioStreamingHR = require('../models/audioStreamingHR');
const AudioStreamingLR = require('../models/audioStreamingLR');
const EModelFullband = require('../models/eModelFullband');
const EModelWideband = require('../models/eModelWideband');
const EModelNarrowband = require('../models/eModelNarrowband');
const Gaming = require('../models/gaming');
const VideoStreamingHR = require('../models/videoStreamingHR');
const VideoStreamingLR = require('../models/videoStreamingLR');
const VideoTelephony = require('../models/videoTelephony');
const VoiceTelephonyNarrowband = require('../models/voiceTelephonyNB');
const VoiceTelephonyWideband = require('../models/voiceTelephonyWB');
const Web1PageSession = require('../models/web1PageSession');
const Web2PageSession = require('../models/web2PageSession');
const WebSingleTimingEvent = require('../models/webSingleTimingEvent');
const Users = require('../models/users');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.allUsers = function(req,res){
    if (req.params.username === 'Administrator'){
        res.status(200);
        Users.find({}).then(function(user){
            res.send(user);
        }).catch((error) => {
            console.log(error);
            res.status(500);
        });
    }
    else {
        res.status(401).json({
            message: 'Administrator ONLY!'
        }); 
    }
};

exports.signUp = function(req,res){
    Users.find({username: req.body.username})
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Username Taken'
            }); //Conflict occurs
        }else if (req.body.password != req.body.passwordConfirmation) {
            return res.status(409).json({
                message: 'Password and Password Confirmation does NOT Match'
            }); //Conflict occurs
        } else{  
            bcrypt.hash(req.body.password,10,(err,hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const token = jwt.sign({
                        username: req.body.username
                    }, 
                    'my_secrete_key',
                    {
                        expiresIn: "1h"
                    }
                    );
                    (new Users({'username': req.body.username , 'password': hash, 
                    'securityQuestion': req.body.securityQuestion, 
                    'securityQuestionAnswer':req.body.securityQuestionAnswer}))
                    .save().then(function(){
                        return res.status(200).json({
                            message: 'Registration Successful',
                            token: token
                        });}).catch(error => {console.log(error)});
                }
            }
        )}}
)};

exports.updatePassword = function(req,res){
    Users.find({username: req.body.username})
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Invalid Username'
            });
        }else if(req.body.password === req.body.passwordConfirmation){   
            if (req.body.securityQuestionAnswer == user[0].securityQuestionAnswer){
                bcrypt.hash(req.body.password,10,(err,hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const updatedUser = { password: hash };
                        Users.findOneAndUpdate({username: req.body.username},updatedUser).then(function(){
                            res.status(200).json({
                                message: 'Successful'
                            });
                    })
                }})
            }else{
                return res.status(401).json({
                    message: 'Incorrect Security Question Answer'
                });
            }
        }else{
            return res.status(401).json({
                message: 'Password and Password Confirmation does not match'
            });
        }
        })
}

exports.updatePasswordSQ = function(req, res) {
    Users.find({ username: req.query.username })
        .then(users => {
            if (users.length === 0) {
                return res.status(401)
            }else{
                res.status(201).json({
                    messageSQD: users[0].securityQuestion
                });
            }
        });
};


exports.login = function(req,res){
    Users.find({username: req.body.username})
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Login Fail'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err,result) =>{
            if (err){
                return res.status(401).json({
                    message: 'Login Fail'
                });
            }
            if (result){
                const token = jwt.sign({
                    username: user[0].username
                }, 
                'my_secrete_key',
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Login Successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Login Fail'
            });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

};

exports.deleteUser = function(req,res){
    const deleteUserInfo = (user) => {
        Gaming.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        AudioStreamingHR.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        AudioStreamingLR.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        EModelFullband.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        EModelWideband.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        EModelNarrowband.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        VideoStreamingHR.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        VideoStreamingLR.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        VoiceTelephonyNarrowband.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        VoiceTelephonyWideband.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        Web1PageSession.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        Web2PageSession.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
        WebSingleTimingEvent.deleteMany({username: req.body.username})
        .then(() => user)
        .catch((error) => console.log(error));
    };
    if (req.params.admin === 'Administrator'){
        res.status(200);
        Users.findOneAndRemove({username: req.body.username})
        .then((user) => {res.send(deleteUserInfo(user));})
        .catch((error) => console.log(error));
    }
    else {
        res.status(401).json({
            message: 'Administrator ONLY!'
        }); 
    }
};

/*exports.allOfAUser = function(req,res){
    if (req.params.admin === 'Administrator'){
        res.status(200);
        Promise.all([
            AudioStreamingHR.find({username: req.body.username}),
            AudioStreamingLR.find({username: req.body.username}),
            EModelFullband.find({username: req.body.username}),
            EModelNarrowband.find({username: req.body.username}),
            EModelWideband.find({username: req.body.username}),
            Gaming.find({username: req.body.username}),
            VideoStreamingHR.find({username: req.body.username}),
            VideoStreamingLR.find({username: req.body.username}),
            VideoTelephony.find({username: req.body.username}),
            VoiceTelephonyNarrowband.find({username: req.body.username}),
            VoiceTelephonyWideband.find({username: req.body.username}),
            Web1PageSession.find({username: req.body.username}),
            Web2PageSession.find({username: req.body.username}),
            WebSingleTimingEvent.find({username: req.body.username})
        ]).then(function(results) {
            const response = {};
            for (const [index, result] of results.entries()) {
                if (result.length > 0) {
                    switch (index) {
                        case 0:
                            response.audioStreamingHR = result;
                            break;
                        case 1:
                            response.audioStreamingLR = result;
                            break;
                        case 2:
                            response.eModelFullband = result;
                            break;
                        case 3:
                            response.eModelNarrowband = result;
                            break;
                        case 4:
                            response.eModelWideband = result;
                            break;
                        case 5:
                            response.gaming = result;
                            break;
                        case 6:
                            response.videoStreamingHR = result;
                            break;
                        case 7:
                            response.videoStreamingLR = result;
                            break;
                        case 8:
                            response.videoTelephony = result;
                            break;
                        case 9:
                            response.voiceTelephonyNarrowband = result;
                            break;
                        case 10:
                            response.voiceTelephonyWideband = result;
                            break;
                        case 11:
                            response.web1PageSession = result;
                            break;
                        case 12:
                            response.web2PageSession = result;
                            break;
                        case 13:
                            response.webSingleTimingEvent = result;
                            break;
                    }
                }
            }
            res.send(response);
        }).catch(error => {console.log(error)});                         
    }else {
        res.status(401).json({
            message: 'Administrator ONLY!'
        }); 
    }
};
*/

exports.allOfAUser = function(req, res) {
    Users.find({ username: req.query.username })
        .then(users => {
            if (users.length === 0) {
                return res.status(401).json({
                    message: 'Invalid username'
                });
            }else{
                res.status(200);
        Promise.all([
            AudioStreamingHR.find({username: req.query.username}),
            AudioStreamingLR.find({username: req.query.username}),
            EModelFullband.find({username: req.query.username}),
            EModelNarrowband.find({username: req.query.username}),
            EModelWideband.find({username: req.query.username}),
            Gaming.find({username: req.query.username}),
            VideoStreamingHR.find({username: req.query.username}),
            VideoStreamingLR.find({username: req.query.username}),
            VideoTelephony.find({username: req.query.username}),
            VoiceTelephonyNarrowband.find({username: req.query.username}),
            VoiceTelephonyWideband.find({username: req.query.username}),
            Web1PageSession.find({username: req.query.username}),
            Web2PageSession.find({username: req.query.username}),
            WebSingleTimingEvent.find({username: req.query.username})
        ]).then(function(results) {
            const response = {};
            for (const [index, result] of results.entries()) {
                if (result.length > 0) {
                    switch (index) {
                        case 0:
                            response.audioStreamingHR = result;
                            break;
                        case 1:
                            response.audioStreamingLR = result;
                            break;
                        case 2:
                            response.eModelFullband = result;
                            break;
                        case 3:
                            response.eModelNarrowband = result;
                            break;
                        case 4:
                            response.eModelWideband = result;
                            break;
                        case 5:
                            response.gaming = result;
                            break;
                        case 6:
                            response.videoStreamingHR = result;
                            break;
                        case 7:
                            response.videoStreamingLR = result;
                            break;
                        case 8:
                            response.videoTelephony = result;
                            break;
                        case 9:
                            response.voiceTelephonyNarrowband = result;
                            break;
                        case 10:
                            response.voiceTelephonyWideband = result;
                            break;
                        case 11:
                            response.web1PageSession = result;
                            break;
                        case 12:
                            response.web2PageSession = result;
                            break;
                        case 13:
                            response.webSingleTimingEvent = result;
                            break;
                    }
                }
            }
            res.status(201).json({
                response: response
            });
        }).catch(error => {console.log(error)});                        
            }
        });
};