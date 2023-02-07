const VoiceTelephonyNarrowband = require('../models/voiceTelephonyNB');
const getID = require("../middleware/generateID");

exports.VoiceTelephonyNB_post = function(req,res){
    if (req.body.speechDelayNB[0] > 1000){
        return res.status(400).json({
            message: 'Speech Delay should be less than 1000'
        }); //Bad Request
    }else if(req.body.speechPacketLossRateNB[0] > 20){
        return res.status(400).json({
            message: 'Speech Packet-Loss Rate should be less than 20%'
        }); //Bad Request
    }else if(req.body.combination[0]<1 || req.body.combination[0]>7 ){
        return res.status(400).json({
            message: 'Combination should be between 1 to 7'
        }); //Bad Request
    } else{    
        var Ts = req.body.speechDelayNB[0], // speechDelayNB
        Ppls = req.body.speechPacketLossRateNB[0], // speechPacketLossRateNB
        TELR = req.body.talkerEchoLoudnessNB[0] , //talkerEchoLoudnessNB 
        combination = req.body.combination[0]; // combination
        
        if (combination == 1){
            var Ies = 15;
            var Bpls = 16.1;
        } else if (combination == 2){
            var Ies = 11;
            var Bpls = 19;
        } else if (combination == 3){
            var Ies = 5;
            var Bpls = 10;
        } else if (combination == 4){
            var Ies = 0;
            var Bpls = 4.3;
        } else if (combination == 5){
            var Ies = 0;
            var Bpls = 25.1;
        } else if (combination == 6){
            var Ies = 4;
            var Bpls = 8.1;
        } else if (combination == 7){
            var Ies = 0;
            var Bpls = 4.8;
        }
        
        var Ieeff = Ies + (95 - Ies) * (Ppls/(Ppls+Bpls));
        
        var TERV = TELR - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
        var Re = 80 + 2.5*(TERV - 14);
        var Idte = (((94.769-Re)/2)+((((94.769-Re)**2)/4)+100)**(0.5)-1) * (1 - Math.exp(-Ts));
        var Q = 93.193 - Idte - Ieeff;
        
        var Sq;
        if (Q < 0){
            Sq = 1;
        } else if (Q>0 && Q<100){
            Sq = 1 + 0.035*Q + Q*(Q-60)*(100-Q)*(7*(10**(-6)));
        } else if (Q>100){
            Sq = 4.5;
        }   
    }

    (new VoiceTelephonyNarrowband({'username': req.params.username , 'speechDelayNB': req.body.speechDelayNB,
    'speechPacketLossRateNB':req.body.speechPacketLossRateNB,
    'talkerEchoLoudnessNB': req.body.talkerEchoLoudnessNB, 'combination':req.body.combination, 
    'idVTNB':getID(), 'mosVTNB':Sq }))
    .save()
    .then(function(voiceTelephonyNarrowband){
        res.send(voiceTelephonyNarrowband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyNBSpeechDelaySA_post = function(req,res){
    var Sq= [];
    for (let i = 0; i <= (req.body.speechDelayNB.length - 1); i++) {
        if (req.body.speechDelayNB[i] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRateNB[0] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        }else if(req.body.combination[0]<1 || req.body.combination[0]>7 ){
            return res.status(400).json({
                message: 'Combination should be between 1 to 7'
            }); //Bad Request
        } else{    
            var Ts = req.body.speechDelayNB[i], // speechDelayNB
            Ppls = req.body.speechPacketLossRateNB[0], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudnessNB[0] , //talkerEchoLoudnessNB 
            combination = req.body.combination[0]; // combination
            
            if (combination == 1){
                var Ies = 15;
                var Bpls = 16.1;
            } else if (combination == 2){
                var Ies = 11;
                var Bpls = 19;
            } else if (combination == 3){
                var Ies = 5;
                var Bpls = 10;
            } else if (combination == 4){
                var Ies = 0;
                var Bpls = 4.3;
            } else if (combination == 5){
                var Ies = 0;
                var Bpls = 25.1;
            } else if (combination == 6){
                var Ies = 4;
                var Bpls = 8.1;
            } else if (combination == 7){
                var Ies = 0;
                var Bpls = 4.8;
            }
            
            var Ieeff = Ies + (95 - Ies) * (Ppls/(Ppls+Bpls));
            
            var TERV = TELR - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var Re = 80 + 2.5*(TERV - 14);
            var Idte = (((94.769-Re)/2)+((((94.769-Re)**2)/4)+100)**(0.5)-1) * (1 - Math.exp(-Ts));
            var Q = 93.193 - Idte - Ieeff;
            
            if (Q < 0){
                Sq[i] = 1;
            } else if (Q>0 && Q<100){
                Sq[i] = 1 + 0.035*Q + Q*(Q-60)*(100-Q)*(7*(10**(-6)));
            } else if (Q>100){
                Sq[i] = 4.5;
            }   
        }    
    }

    (new VoiceTelephonyNarrowband({'username': req.params.username , 'speechDelayNB': req.body.speechDelayNB,
    'speechPacketLossRateNB':req.body.speechPacketLossRateNB,
    'talkerEchoLoudnessNB': req.body.talkerEchoLoudnessNB, 'combination':req.body.combination, 
    'idVTNB':getID(), 'mosVTNB':Sq }))
    .save()
    .then(function(voiceTelephonyNarrowband){
        res.send(voiceTelephonyNarrowband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyNBPacketLossSA_post = function(req,res){
    var Sq= [];
    for (let i = 0; i <= (req.body.speechPacketLossRateNB.length - 1); i++) {
        if (req.body.speechDelayNB[0] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRateNB[i] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        }else if(req.body.combination[0]<1 || req.body.combination[0]>7 ){
            return res.status(400).json({
                message: 'Combination should be between 1 to 7'
            }); //Bad Request
        } else{    
            var Ts = req.body.speechDelayNB[0], // speechDelayNB
            Ppls = req.body.speechPacketLossRateNB[i], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudnessNB[0] , //talkerEchoLoudnessNB 
            combination = req.body.combination[0]; // combination
            
            if (combination == 1){
                var Ies = 15;
                var Bpls = 16.1;
            } else if (combination == 2){
                var Ies = 11;
                var Bpls = 19;
            } else if (combination == 3){
                var Ies = 5;
                var Bpls = 10;
            } else if (combination == 4){
                var Ies = 0;
                var Bpls = 4.3;
            } else if (combination == 5){
                var Ies = 0;
                var Bpls = 25.1;
            } else if (combination == 6){
                var Ies = 4;
                var Bpls = 8.1;
            } else if (combination == 7){
                var Ies = 0;
                var Bpls = 4.8;
            }
            
            var Ieeff = Ies + (95 - Ies) * (Ppls/(Ppls+Bpls));
            
            var TERV = TELR - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var Re = 80 + 2.5*(TERV - 14);
            var Idte = (((94.769-Re)/2)+((((94.769-Re)**2)/4)+100)**(0.5)-1) * (1 - Math.exp(-Ts));
            var Q = 93.193 - Idte - Ieeff;
            
            if (Q < 0){
                Sq[i] = 1;
            } else if (Q>0 && Q<100){
                Sq[i] = 1 + 0.035*Q + Q*(Q-60)*(100-Q)*(7*(10**(-6)));
            } else if (Q>100){
                Sq[i] = 4.5;
            }   
        }    
    }

    (new VoiceTelephonyNarrowband({'username': req.params.username , 'speechDelayNB': req.body.speechDelayNB,
    'speechPacketLossRateNB':req.body.speechPacketLossRateNB,
    'talkerEchoLoudnessNB': req.body.talkerEchoLoudnessNB, 'combination':req.body.combination, 
    'idVTNB':getID(), 'mosVTNB':Sq }))
    .save()
    .then(function(voiceTelephonyNarrowband){
        res.send(voiceTelephonyNarrowband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyNBTalkerEchoSA_post = function(req,res){
    var Sq= [];
    for (let i = 0; i <= (req.body.talkerEchoLoudnessNB.length - 1); i++) {
        if (req.body.speechDelayNB[0] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRateNB[0] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        }else if(req.body.combination[0]<1 || req.body.combination[0]>7 ){
            return res.status(400).json({
                message: 'Combination should be between 1 to 7'
            }); //Bad Request
        } else{    
            var Ts = req.body.speechDelayNB[0], // speechDelayNB
            Ppls = req.body.speechPacketLossRateNB[0], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudnessNB[i] , //talkerEchoLoudnessNB 
            combination = req.body.combination[0]; // combination
            
            if (combination == 1){
                var Ies = 15;
                var Bpls = 16.1;
            } else if (combination == 2){
                var Ies = 11;
                var Bpls = 19;
            } else if (combination == 3){
                var Ies = 5;
                var Bpls = 10;
            } else if (combination == 4){
                var Ies = 0;
                var Bpls = 4.3;
            } else if (combination == 5){
                var Ies = 0;
                var Bpls = 25.1;
            } else if (combination == 6){
                var Ies = 4;
                var Bpls = 8.1;
            } else if (combination == 7){
                var Ies = 0;
                var Bpls = 4.8;
            }
            
            var Ieeff = Ies + (95 - Ies) * (Ppls/(Ppls+Bpls));
            
            var TERV = TELR - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var Re = 80 + 2.5*(TERV - 14);
            var Idte = (((94.769-Re)/2)+((((94.769-Re)**2)/4)+100)**(0.5)-1) * (1 - Math.exp(-Ts));
            var Q = 93.193 - Idte - Ieeff;
            
            if (Q < 0){
                Sq[i] = 1;
            } else if (Q>0 && Q<100){
                Sq[i] = 1 + 0.035*Q + Q*(Q-60)*(100-Q)*(7*(10**(-6)));
            } else if (Q>100){
                Sq[i] = 4.5;
            }   
        }    
    }

    (new VoiceTelephonyNarrowband({'username': req.params.username , 'speechDelayNB': req.body.speechDelayNB,
    'speechPacketLossRateNB':req.body.speechPacketLossRateNB,
    'talkerEchoLoudnessNB': req.body.talkerEchoLoudnessNB, 'combination':req.body.combination, 
    'idVTNB':getID(), 'mosVTNB':Sq }))
    .save()
    .then(function(voiceTelephonyNarrowband){
        res.send(voiceTelephonyNarrowband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyNBCombinationSA_post = function(req,res){
    var Sq= [];
    for (let i = 0; i <= (req.body.combination.length - 1); i++) {
        if (req.body.speechDelayNB[0] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRateNB[0] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        }else if(req.body.combination[i]<1 || req.body.combination[i]>7 ){
            return res.status(400).json({
                message: 'Combination should be between 1 to 7'
            }); //Bad Request
        } else{    
            var Ts = req.body.speechDelayNB[0], // speechDelayNB
            Ppls = req.body.speechPacketLossRateNB[0], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudnessNB[0] , //talkerEchoLoudnessNB 
            combination = req.body.combination[i]; // combination
            
            if (combination == 1){
                var Ies = 15;
                var Bpls = 16.1;
            } else if (combination == 2){
                var Ies = 11;
                var Bpls = 19;
            } else if (combination == 3){
                var Ies = 5;
                var Bpls = 10;
            } else if (combination == 4){
                var Ies = 0;
                var Bpls = 4.3;
            } else if (combination == 5){
                var Ies = 0;
                var Bpls = 25.1;
            } else if (combination == 6){
                var Ies = 4;
                var Bpls = 8.1;
            } else if (combination == 7){
                var Ies = 0;
                var Bpls = 4.8;
            }
            
            var Ieeff = Ies + (95 - Ies) * (Ppls/(Ppls+Bpls));
            
            var TERV = TELR - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var Re = 80 + 2.5*(TERV - 14);
            var Idte = (((94.769-Re)/2)+((((94.769-Re)**2)/4)+100)**(0.5)-1) * (1 - Math.exp(-Ts));
            var Q = 93.193 - Idte - Ieeff;
            
            if (Q < 0){
                Sq[i] = 1;
            } else if (Q>0 && Q<100){
                Sq[i] = 1 + 0.035*Q + Q*(Q-60)*(100-Q)*(7*(10**(-6)));
            } else if (Q>100){
                Sq[i] = 4.5;
            }   
        }    
    }

    (new VoiceTelephonyNarrowband({'username': req.params.username , 'speechDelayNB': req.body.speechDelayNB,
    'speechPacketLossRateNB':req.body.speechPacketLossRateNB,
    'talkerEchoLoudnessNB': req.body.talkerEchoLoudnessNB, 'combination':req.body.combination, 
    'idVTNB':getID(), 'mosVTNB':Sq }))
    .save()
    .then(function(voiceTelephonyNarrowband){
        res.send(voiceTelephonyNarrowband);
    }).catch(error => {console.log(error)});
};