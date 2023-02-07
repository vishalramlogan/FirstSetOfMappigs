const AudioStreamingHR = require('../models/audioStreamingHR');
const getID = require("../middleware/generateID");

exports.AudioStreamingHR_post = function(req,res){
    if (req.body.rtpPacketLoss[0] > 100 || req.body.rtpPacketLoss[0] < 0){
        return res.status(400).json({
            message: 'RTP Packet Loss should be between 1 and 100'
        }); //Bad Request
    }else if(req.body.audioCodec[0] != 'Mp2' && req.body.audioCodec[0] != 'AC3' && req.body.audioCodec[0] != 'AacLC' && req.body.audioCodec[0] != 'HeAac'){
        return res.status(400).json({
            message: 'Enter a valid Audio Codec from table'
        }); //Bad Request
    }else {
        var BitrateA = req.body.audioBitrate[0], //audioBitrate
        BitrateV  = req.body.videoBitrate[0], // videoBitrate
        RTPpacketLoss = req.body.rtpPacketLoss[0], // rtpPacketLoss
        RTPburstiness = req.body.rtpPacketLossBurstiness[0], //rtpPacketLossBurstiness
        D = req.body.numRTPPacketsTSPackets[0], // numRTPPacketsTSPackets
        audioCodec = req.body.audioCodec[0],
        burstLengthA = req.body.burstLengthA[0];
        
        if(audioCodec == 'Mp2'){
            var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
            c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
        }else if (audioCodec == 'AC3'){
            var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
            c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
        }else if (audioCodec == 'AacLC'){
            var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
            c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
        }else if (audioCodec == 'HeAac'){
            var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
            c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
        }
        
        if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
            var TSpacketLossA = RTPpacketLoss;
            var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
        } else{
            var TSpacketLossA = RTPpacketLoss;
            var TSBurstinessA = 7 * RTPburstiness;
        }
        
        for (let NTSV = 1; NTSV <= 6; NTSV++){
            if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                TSpacketLossA = RTPburstiness;
                TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
            }
        }
        
        var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
        var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
        var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
        var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
        
        var QA = 100 - QcodA - QtraA;
    
        var mos_max = 4.9, mos_min = 1.05;
        if (QA > 0 && QA < 100){
            var MOS = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
        } else if (QA >= 100){
            var MOS = mos_max;
        }else{
            var MOS = mos_min;
        }    
    }
        
      (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingHRAudioBitrateSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.audioBitrate.length - 1); i++) {
        if (req.body.rtpPacketLoss[0] > 100 || req.body.rtpPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 1 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'Mp2' && req.body.audioCodec[0] != 'AC3' && req.body.audioCodec[0] != 'AacLC' && req.body.audioCodec[0] != 'HeAac'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        } else{
            var BitrateA = req.body.audioBitrate[i], //audioBitrate
            BitrateV  = req.body.videoBitrate[0], // videoBitrate
            RTPpacketLoss = req.body.rtpPacketLoss[0], // rtpPacketLoss
            RTPburstiness = req.body.rtpPacketLossBurstiness[0], //rtpPacketLossBurstiness
            D = req.body.numRTPPacketsTSPackets[0], // numRTPPacketsTSPackets
            audioCodec = req.body.audioCodec[0],
            burstLengthA = req.body.burstLengthA[0];
            
            if(audioCodec == 'Mp2'){
                var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
                c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
            }else if (audioCodec == 'AC3'){
                var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
                c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
            }else if (audioCodec == 'AacLC'){
                var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
                c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
            }else if (audioCodec == 'HeAac'){
                var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
                c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
            }
            
            if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
            } else{
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = 7 * RTPburstiness;
            }
            
            for (let NTSV = 1; NTSV <= 6; NTSV++){
                if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                    TSpacketLossA = RTPburstiness;
                    TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
                }
            }
            
            var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
            var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
            var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
            var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
            
            var QA = 100 - QcodA - QtraA;
        
            var mos_max = 4.9, mos_min = 1.05;
            if (QA > 0 && QA < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
            } else if (QA >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }    
    }

    (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingHRVideoBitrateSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.videoBitrate.length - 1); i++) {
        if (req.body.rtpPacketLoss[0] > 100 || req.body.rtpPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 1 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'Mp2' && req.body.audioCodec[0] != 'AC3' && req.body.audioCodec[0] != 'AacLC' && req.body.audioCodec[0] != 'HeAac'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        } else{
            var BitrateA = req.body.audioBitrate[0], //audioBitrate
            BitrateV  = req.body.videoBitrate[i], // videoBitrate
            RTPpacketLoss = req.body.rtpPacketLoss[0], // rtpPacketLoss
            RTPburstiness = req.body.rtpPacketLossBurstiness[0], //rtpPacketLossBurstiness
            D = req.body.numRTPPacketsTSPackets[0], // numRTPPacketsTSPackets
            audioCodec = req.body.audioCodec[0],
            burstLengthA = req.body.burstLengthA[0];
            
            if(audioCodec == 'Mp2'){
                var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
                c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
            }else if (audioCodec == 'AC3'){
                var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
                c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
            }else if (audioCodec == 'AacLC'){
                var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
                c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
            }else if (audioCodec == 'HeAac'){
                var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
                c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
            }
            
            if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
            } else{
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = 7 * RTPburstiness;
            }
            
            for (let NTSV = 1; NTSV <= 6; NTSV++){
                if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                    TSpacketLossA = RTPburstiness;
                    TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
                }
            }
            
            var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
            var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
            var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
            var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
            
            var QA = 100 - QcodA - QtraA;
        
            var mos_max = 4.9, mos_min = 1.05;
            if (QA > 0 && QA < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
            } else if (QA >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }    
    }

    (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingHRPacketLossSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.rtpPacketLoss.length - 1); i++) {
        if (req.body.rtpPacketLoss[i] > 100 || req.body.rtpPacketLoss[i] < 1){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 1 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'Mp2' && req.body.audioCodec[0] != 'AC3' && req.body.audioCodec[0] != 'AacLC' && req.body.audioCodec[0] != 'HeAac'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        } else{
            var BitrateA = req.body.audioBitrate[0], //audioBitrate
            BitrateV  = req.body.videoBitrate[0], // videoBitrate
            RTPpacketLoss = req.body.rtpPacketLoss[i], // rtpPacketLoss
            RTPburstiness = req.body.rtpPacketLossBurstiness[0], //rtpPacketLossBurstiness
            D = req.body.numRTPPacketsTSPackets[0], // numRTPPacketsTSPackets
            audioCodec = req.body.audioCodec[0],
            burstLengthA = req.body.burstLengthA[0];
            
            if(audioCodec == 'Mp2'){
                var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
                c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
            }else if (audioCodec == 'AC3'){
                var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
                c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
            }else if (audioCodec == 'AacLC'){
                var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
                c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
            }else if (audioCodec == 'HeAac'){
                var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
                c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
            }
            
            if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
            } else{
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = 7 * RTPburstiness;
            }
            
            for (let NTSV = 1; NTSV <= 6; NTSV++){
                if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                    TSpacketLossA = RTPburstiness;
                    TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
                }
            }
            
            var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
            var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
            var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
            var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
            
            var QA = 100 - QcodA - QtraA;
        
            var mos_max = 4.9, mos_min = 1.05;
            if (QA > 0 && QA < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
            } else if (QA >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }    
    }

    (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingHRPacketLossBurstinessSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.rtpPacketLossBurstiness.length - 1); i++) {
        if (req.body.rtpPacketLoss[0] > 100 || req.body.rtpPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 1 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'Mp2' && req.body.audioCodec[0] != 'AC3' && req.body.audioCodec[0] != 'AacLC' && req.body.audioCodec[0] != 'HeAac'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        } else{
            var BitrateA = req.body.audioBitrate[0], //audioBitrate
            BitrateV  = req.body.videoBitrate[0], // videoBitrate
            RTPpacketLoss = req.body.rtpPacketLoss[0], // rtpPacketLoss
            RTPburstiness = req.body.rtpPacketLossBurstiness[i], //rtpPacketLossBurstiness
            D = req.body.numRTPPacketsTSPackets[0], // numRTPPacketsTSPackets
            audioCodec = req.body.audioCodec[0],
            burstLengthA = req.body.burstLengthA[0];
            
            if(audioCodec == 'Mp2'){
                var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
                c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
            }else if (audioCodec == 'AC3'){
                var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
                c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
            }else if (audioCodec == 'AacLC'){
                var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
                c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
            }else if (audioCodec == 'HeAac'){
                var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
                c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
            }
            
            if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
            } else{
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = 7 * RTPburstiness;
            }
            
            for (let NTSV = 1; NTSV <= 6; NTSV++){
                if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                    TSpacketLossA = RTPburstiness;
                    TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
                }
            }
            
            var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
            var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
            var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
            var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
            
            var QA = 100 - QcodA - QtraA;
        
            var mos_max = 4.9, mos_min = 1.05;
            if (QA > 0 && QA < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
            } else if (QA >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }    
    }

    (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingHRNumTSPacketsSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.numRTPPacketsTSPackets.length - 1); i++) {
        if (req.body.rtpPacketLoss[0] > 100 || req.body.rtpPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 1 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'Mp2' && req.body.audioCodec[0] != 'AC3' && req.body.audioCodec[0] != 'AacLC' && req.body.audioCodec[0] != 'HeAac'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        } else{
            var BitrateA = req.body.audioBitrate[0], //audioBitrate
            BitrateV  = req.body.videoBitrate[0], // videoBitrate
            RTPpacketLoss = req.body.rtpPacketLoss[0], // rtpPacketLoss
            RTPburstiness = req.body.rtpPacketLossBurstiness[0], //rtpPacketLossBurstiness
            D = req.body.numRTPPacketsTSPackets[i], // numRTPPacketsTSPackets
            audioCodec = req.body.audioCodec[0],
            burstLengthA = req.body.burstLengthA[0];
            
            if(audioCodec == 'Mp2'){
                var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
                c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
            }else if (audioCodec == 'AC3'){
                var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
                c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
            }else if (audioCodec == 'AacLC'){
                var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
                c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
            }else if (audioCodec == 'HeAac'){
                var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
                c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
            }
            
            if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
            } else{
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = 7 * RTPburstiness;
            }
            
            for (let NTSV = 1; NTSV <= 6; NTSV++){
                if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                    TSpacketLossA = RTPburstiness;
                    TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
                }
            }
            
            var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
            var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
            var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
            var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
            
            var QA = 100 - QcodA - QtraA;
        
            var mos_max = 4.9, mos_min = 1.05;
            if (QA > 0 && QA < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
            } else if (QA >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }    
    }

    (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingHRAudioCodecSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.audioCodec.length - 1); i++) {
        if (req.body.rtpPacketLoss[0] > 100 || req.body.rtpPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 1 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[i] != 'Mp2' && req.body.audioCodec[i] != 'AC3' && req.body.audioCodec[i] != 'AacLC' && req.body.audioCodec[i] != 'HeAac'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        } else{
            var BitrateA = req.body.audioBitrate[0], //audioBitrate
            BitrateV  = req.body.videoBitrate[0], // videoBitrate
            RTPpacketLoss = req.body.rtpPacketLoss[0], // rtpPacketLoss
            RTPburstiness = req.body.rtpPacketLossBurstiness[0], //rtpPacketLossBurstiness
            D = req.body.numRTPPacketsTSPackets[0], // numRTPPacketsTSPackets
            audioCodec = req.body.audioCodec[i],
            burstLengthA = req.body.burstLengthA[0];
            
            if(audioCodec == 'Mp2'){
                var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
                c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
            }else if (audioCodec == 'AC3'){
                var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
                c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
            }else if (audioCodec == 'AacLC'){
                var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
                c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
            }else if (audioCodec == 'HeAac'){
                var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
                c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
            }
            
            if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
            } else{
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = 7 * RTPburstiness;
            }
            
            for (let NTSV = 1; NTSV <= 6; NTSV++){
                if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                    TSpacketLossA = RTPburstiness;
                    TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
                }
            }
            
            var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
            var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
            var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
            var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
            
            var QA = 100 - QcodA - QtraA;
        
            var mos_max = 4.9, mos_min = 1.05;
            if (QA > 0 && QA < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
            } else if (QA >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }    
    }

    (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingHRBurstLengthSA_post = function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.burstLengthA.length - 1); i++) {
        if (req.body.rtpPacketLoss[0] > 100 || req.body.rtpPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 1 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'Mp2' && req.body.audioCodec[0] != 'AC3' && req.body.audioCodec[0] != 'AacLC' && req.body.audioCodec[0] != 'HeAac'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        } else{
            var BitrateA = req.body.audioBitrate[0], //audioBitrate
            BitrateV  = req.body.videoBitrate[0], // videoBitrate
            RTPpacketLoss = req.body.rtpPacketLoss[0], // rtpPacketLoss
            RTPburstiness = req.body.rtpPacketLossBurstiness[0], //rtpPacketLossBurstiness
            D = req.body.numRTPPacketsTSPackets[0], // numRTPPacketsTSPackets
            audioCodec = req.body.audioCodec[0],
            burstLengthA = req.body.burstLengthA[i];
            
            if(audioCodec == 'Mp2'){
                var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
                c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
            }else if (audioCodec == 'AC3'){
                var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
                c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
            }else if (audioCodec == 'AacLC'){
                var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
                c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
            }else if (audioCodec == 'HeAac'){
                var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
                c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
            }
            
            if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
            } else{
                var TSpacketLossA = RTPpacketLoss;
                var TSBurstinessA = 7 * RTPburstiness;
            }
            
            for (let NTSV = 1; NTSV <= 6; NTSV++){
                if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
                    TSpacketLossA = RTPburstiness;
                    TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
                }
            }
            
            var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;
            var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
            var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
            var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));
            
            var QA = 100 - QcodA - QtraA;
        
            var mos_max = 4.9, mos_min = 1.05;
            if (QA > 0 && QA < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
            } else if (QA >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }    
    }

    (new AudioStreamingHR({'username': req.params.username , 'audioBitrate': req.body.audioBitrate, 'videoBitrate':req.body.videoBitrate,
    'rtpPacketLoss': req.body.rtpPacketLoss, 'rtpPacketLossBurstiness':req.body.rtpPacketLossBurstiness, 
    'numRTPPacketsTSPackets': req.body.numRTPPacketsTSPackets, 'burstLengthA':req.body.burstLengthA,  'audioCodec':req.body.audioCodec, 
    'idASHR':getID(), 'mosASHR':MOS }))
    .save()
    .then(function(audioStreamingHR){
        res.send(audioStreamingHR);
    }).catch(error => {console.log(error)});
};