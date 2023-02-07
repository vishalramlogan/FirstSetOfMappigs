const VoiceTelephonyWideband = require('../models/voiceTelephonyWB');
const getID = require("../middleware/generateID");

exports.VoiceTelephonyWB_post = function(req,res){
    if (req.body.speechDelay[0] > 1000){
        return res.status(400).json({
            message: 'Speech Delay should be less than 1000'
        }); //Bad Request
    }else if(req.body.speechPacketLossRate[0] > 20){
        return res.status(400).json({
            message: 'Speech Packet-Loss Rate should be less than 20%'
        }); //Bad Request
    } else{
        var Ts = req.body.speechDelay[0], // speechDelayNB
        Ppls = req.body.speechPacketLossRate[0], // speechPacketLossRateNB
        TELR = req.body.talkerEchoLoudness[0], //talkerEchoLoudnessNB 
        IesWB = req.body.equipmentImpairment[0], // Equipment Impairment Factor
        Bpls = req.body.packetLossRoubustness[0]; // Packet-Loss Robustness Factor
            
        var IeeffWB = IesWB + (95 - IesWB) * (Ppls/(Ppls+Bpls));
        if (Ts < 100){
            var K = (0.08*Ts) + 10;
        } else if (Ts >= 100){
            var K = 18;
        }
        var TERVWB = TELR + K - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
        var ReWB = 80 + 3*(TERVWB - 14);
        var IdteWB = (((129-ReWB)/2) + ((((129-ReWB)**2)/4)+100)**(0.5) - 1) * (1 - Math.exp(-Ts));
        
        var Q = 129 - IdteWB - IeeffWB;
        var Qx = Q / 1.29;
        
        var Sq;
        if (Qx < 0){
            Sq = 1;
        } else if (Qx>0 && Qx<100){
            Sq = 1 + 0.035*Qx + Qx*(Qx-60)*(100-Qx)*(7*(10**(-6)));
        } else if (Qx>=100){
            Sq = 4.5;
        }
    }
   
    (new VoiceTelephonyWideband({'username': req.params.username , 'speechDelay': req.body.speechDelay,
    'speechPacketLossRate':req.body.speechPacketLossRate,'talkerEchoLoudness': req.body.talkerEchoLoudness, 
    'equipmentImpairment':req.body.equipmentImpairment, 'packetLossRoubustness':req.body.packetLossRoubustness, 
    'idVTWB':getID(), 'mosVTWB':Sq }))
    .save()
    .then(function(voiceTelephonyWideband){
        res.send(voiceTelephonyWideband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyWBSpeechDelaySA_post = function(req,res){
    var Sq = [];
    for (let i = 0; i <= (req.body.speechDelay.length - 1); i++) {
        if (req.body.speechDelay[i] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRate[0] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        } else{
            var Ts = req.body.speechDelay[i], // speechDelayNB
            Ppls = req.body.speechPacketLossRate[0], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudness[0], //talkerEchoLoudnessNB 
            IesWB = req.body.equipmentImpairment[0], // Equipment Impairment Factor
            Bpls = req.body.packetLossRoubustness[0]; // Packet-Loss Robustness Factor
                
            var IeeffWB = IesWB + (95 - IesWB) * (Ppls/(Ppls+Bpls));
            if (Ts < 100){
                var K = (0.08*Ts) + 10;
            } else if (Ts >= 100){
                var K = 18;
            }
            var TERVWB = TELR + K - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var ReWB = 80 + 3*(TERVWB - 14);
            var IdteWB = (((129-ReWB)/2) + ((((129-ReWB)**2)/4)+100)**(0.5) - 1) * (1 - Math.exp(-Ts));
            
            var Q = 129 - IdteWB - IeeffWB;
            var Qx = Q / 1.29;
            
            if (Qx < 0){
                Sq[i] = 1;
            } else if (Qx>0 && Qx<100){
                Sq[i] = 1 + 0.035*Qx + Qx*(Qx-60)*(100-Qx)*(7*(10**(-6)));
            } else if (Qx>=100){
                Sq[i] = 4.5;
            }
        }    
    }
    (new VoiceTelephonyWideband({'username': req.params.username , 'speechDelay': req.body.speechDelay,
    'speechPacketLossRate':req.body.speechPacketLossRate,'talkerEchoLoudness': req.body.talkerEchoLoudness, 
    'equipmentImpairment':req.body.equipmentImpairment, 'packetLossRoubustness':req.body.packetLossRoubustness, 
    'idVTWB':getID(), 'mosVTWB':Sq }))
    .save()
    .then(function(voiceTelephonyWideband){
        res.send(voiceTelephonyWideband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyWBPacketLossSA_post = function(req,res){
    var Sq = [];
    for (let i = 0; i <= (req.body.speechPacketLossRate.length - 1); i++) {
        if (req.body.speechDelay[0] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRate[i] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        } else{
            var Ts = req.body.speechDelay[0], // speechDelayNB
            Ppls = req.body.speechPacketLossRate[i], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudness[0], //talkerEchoLoudnessNB 
            IesWB = req.body.equipmentImpairment[0], // Equipment Impairment Factor
            Bpls = req.body.packetLossRoubustness[0]; // Packet-Loss Robustness Factor
                
            var IeeffWB = IesWB + (95 - IesWB) * (Ppls/(Ppls+Bpls));
            if (Ts < 100){
                var K = (0.08*Ts) + 10;
            } else if (Ts >= 100){
                var K = 18;
            }
            var TERVWB = TELR + K - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var ReWB = 80 + 3*(TERVWB - 14);
            var IdteWB = (((129-ReWB)/2) + ((((129-ReWB)**2)/4)+100)**(0.5) - 1) * (1 - Math.exp(-Ts));
            
            var Q = 129 - IdteWB - IeeffWB;
            var Qx = Q / 1.29;
            
            if (Qx < 0){
                Sq[i] = 1;
            } else if (Qx>0 && Qx<100){
                Sq[i] = 1 + 0.035*Qx + Qx*(Qx-60)*(100-Qx)*(7*(10**(-6)));
            } else if (Qx>=100){
                Sq[i] = 4.5;
            }
        }    
    }
    (new VoiceTelephonyWideband({'username': req.params.username , 'speechDelay': req.body.speechDelay,
    'speechPacketLossRate':req.body.speechPacketLossRate,'talkerEchoLoudness': req.body.talkerEchoLoudness, 
    'equipmentImpairment':req.body.equipmentImpairment, 'packetLossRoubustness':req.body.packetLossRoubustness, 
    'idVTWB':getID(), 'mosVTWB':Sq }))
    .save()
    .then(function(voiceTelephonyWideband){
        res.send(voiceTelephonyWideband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyWBTalkerEchoSA_post = function(req,res){
    var Sq = [];
    for (let i = 0; i <= (req.body.talkerEchoLoudness.length - 1); i++) {
        if (req.body.speechDelay[0] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRate[0] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        } else{
            var Ts = req.body.speechDelay[0], // speechDelayNB
            Ppls = req.body.speechPacketLossRate[0], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudness[i], //talkerEchoLoudnessNB 
            IesWB = req.body.equipmentImpairment[0], // Equipment Impairment Factor
            Bpls = req.body.packetLossRoubustness[0]; // Packet-Loss Robustness Factor
                
            var IeeffWB = IesWB + (95 - IesWB) * (Ppls/(Ppls+Bpls));
            if (Ts < 100){
                var K = (0.08*Ts) + 10;
            } else if (Ts >= 100){
                var K = 18;
            }
            var TERVWB = TELR + K - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var ReWB = 80 + 3*(TERVWB - 14);
            var IdteWB = (((129-ReWB)/2) + ((((129-ReWB)**2)/4)+100)**(0.5) - 1) * (1 - Math.exp(-Ts));
            
            var Q = 129 - IdteWB - IeeffWB;
            var Qx = Q / 1.29;
            
            if (Qx < 0){
                Sq[i] = 1;
            } else if (Qx>0 && Qx<100){
                Sq[i] = 1 + 0.035*Qx + Qx*(Qx-60)*(100-Qx)*(7*(10**(-6)));
            } else if (Qx>=100){
                Sq[i] = 4.5;
            }
        }    
    }
    (new VoiceTelephonyWideband({'username': req.params.username , 'speechDelay': req.body.speechDelay,
    'speechPacketLossRate':req.body.speechPacketLossRate,'talkerEchoLoudness': req.body.talkerEchoLoudness, 
    'equipmentImpairment':req.body.equipmentImpairment, 'packetLossRoubustness':req.body.packetLossRoubustness, 
    'idVTWB':getID(), 'mosVTWB':Sq }))
    .save()
    .then(function(voiceTelephonyWideband){
        res.send(voiceTelephonyWideband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyWBEquipmentImpairmentSA_post = function(req,res){
    var Sq = [];
    for (let i = 0; i <= (req.body.equipmentImpairment.length - 1); i++) {
        if (req.body.speechDelay[0] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRate[0] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        } else{
            var Ts = req.body.speechDelay[0], // speechDelayNB
            Ppls = req.body.speechPacketLossRate[0], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudness[0], //talkerEchoLoudnessNB 
            IesWB = req.body.equipmentImpairment[i], // Equipment Impairment Factor
            Bpls = req.body.packetLossRoubustness[0]; // Packet-Loss Robustness Factor
                
            var IeeffWB = IesWB + (95 - IesWB) * (Ppls/(Ppls+Bpls));
            if (Ts < 100){
                var K = (0.08*Ts) + 10;
            } else if (Ts >= 100){
                var K = 18;
            }
            var TERVWB = TELR + K - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var ReWB = 80 + 3*(TERVWB - 14);
            var IdteWB = (((129-ReWB)/2) + ((((129-ReWB)**2)/4)+100)**(0.5) - 1) * (1 - Math.exp(-Ts));
            
            var Q = 129 - IdteWB - IeeffWB;
            var Qx = Q / 1.29;
            
            if (Qx < 0){
                Sq[i] = 1;
            } else if (Qx>0 && Qx<100){
                Sq[i] = 1 + 0.035*Qx + Qx*(Qx-60)*(100-Qx)*(7*(10**(-6)));
            } else if (Qx>=100){
                Sq[i] = 4.5;
            }
        }    
    }
    (new VoiceTelephonyWideband({'username': req.params.username , 'speechDelay': req.body.speechDelay,
    'speechPacketLossRate':req.body.speechPacketLossRate,'talkerEchoLoudness': req.body.talkerEchoLoudness, 
    'equipmentImpairment':req.body.equipmentImpairment, 'packetLossRoubustness':req.body.packetLossRoubustness, 
    'idVTWB':getID(), 'mosVTWB':Sq }))
    .save()
    .then(function(voiceTelephonyWideband){
        res.send(voiceTelephonyWideband);
    }).catch(error => {console.log(error)});
};

exports.VoiceTelephonyWBPacketLossRoubustnessSA_post = function(req,res){
    var Sq = [];
    for (let i = 0; i <= (req.body.packetLossRoubustness.length - 1); i++) {
        if (req.body.speechDelay[0] > 1000){
            return res.status(400).json({
                message: 'Speech Delay should be less than 1000'
            }); //Bad Request
        }else if(req.body.speechPacketLossRate[0] > 20){
            return res.status(400).json({
                message: 'Speech Packet-Loss Rate should be less than 20%'
            }); //Bad Request
        } else{
            var Ts = req.body.speechDelay[0], // speechDelayNB
            Ppls = req.body.speechPacketLossRate[0], // speechPacketLossRateNB
            TELR = req.body.talkerEchoLoudness[0], //talkerEchoLoudnessNB 
            IesWB = req.body.equipmentImpairment[0], // Equipment Impairment Factor
            Bpls = req.body.packetLossRoubustness[i]; // Packet-Loss Robustness Factor
                
            var IeeffWB = IesWB + (95 - IesWB) * (Ppls/(Ppls+Bpls));
            if (Ts < 100){
                var K = (0.08*Ts) + 10;
            } else if (Ts >= 100){
                var K = 18;
            }
            var TERVWB = TELR + K - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
            var ReWB = 80 + 3*(TERVWB - 14);
            var IdteWB = (((129-ReWB)/2) + ((((129-ReWB)**2)/4)+100)**(0.5) - 1) * (1 - Math.exp(-Ts));
            
            var Q = 129 - IdteWB - IeeffWB;
            var Qx = Q / 1.29;
            
            if (Qx < 0){
                Sq[i] = 1;
            } else if (Qx>0 && Qx<100){
                Sq[i] = 1 + 0.035*Qx + Qx*(Qx-60)*(100-Qx)*(7*(10**(-6)));
            } else if (Qx>=100){
                Sq[i] = 4.5;
            }
        }    
    }
    (new VoiceTelephonyWideband({'username': req.params.username , 'speechDelay': req.body.speechDelay,
    'speechPacketLossRate':req.body.speechPacketLossRate,'talkerEchoLoudness': req.body.talkerEchoLoudness, 
    'equipmentImpairment':req.body.equipmentImpairment, 'packetLossRoubustness':req.body.packetLossRoubustness, 
    'idVTWB':getID(), 'mosVTWB':Sq }))
    .save()
    .then(function(voiceTelephonyWideband){
        res.send(voiceTelephonyWideband);
    }).catch(error => {console.log(error)});
};