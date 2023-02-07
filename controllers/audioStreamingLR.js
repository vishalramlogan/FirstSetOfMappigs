const AudioStreamingLR = require('../models/audioStreamingLR');
const getID = require("../middleware/generateID");

exports.AudioStreamingLR_post = function(req,res){
    if (req.body.lossRateIPPackets[0] > 100 || req.body.lossRateIPPackets[0] < 0){
        return res.status(400).json({
            message: 'RTP Packet Loss should be between 0 and 100'
        }); //Bad Request
    }else if(req.body.audioCodec[0] != 'AAC-LC' && req.body.audioCodec[0] != 'AAC-HEv1' && req.body.audioCodec[0] != 'AAC-HEv2' && req.body.audioCodec[0] != 'AMR-NB' && req.body.audioCodec[0] != 'AMR-WB+'){
        return res.status(400).json({
            message: 'Enter a valid Audio Codec from table'
        }); //Bad Request
    }else {    
        var A_BR = req.body.audioBitrateLR[0],//audioBitrateLR
        AudioFrameLength = req.body.audioFrameLength[0],//audioFrameLength
        IPPacketAverageBurstLength = req.body.averageBurstIP[0], // averageBurstIP
        MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[0],
        IPpacketLossRate = req.body.lossRateIPPackets[0], // lossRateIPPackets
        NumberofAudioFramesperPacket = req.body.numAudioFrames[0], // numAudioFrames
        audioCodec = req.body.audioCodec[0] ;
        
        if (audioCodec == 'AAC-LC'){
            var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
        }else if (audioCodec == 'AAC-HEv1'){
            var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
        }else if (audioCodec == 'AAC-HEv2'){
            var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
        }else if (audioCodec == 'AMR-NB'){
            var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
        }else if (audioCodec == 'AMR-WB+'){
            var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
        }
        
        var A_MT = 1;
        var A_ABPLL = IPPacketAverageBurstLength;
        var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
        var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
        var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
        if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
            var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
        } else{
            var A_LFL = A_PLEF * AudioFrameLength;
        }
            
        var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
        var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
        
        var A_MOS = 1 + ((A_MOSC -1)*MA);    
    }

    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingLRAudioBitrateSA_post = function(req,res){
    var A_MOS = [];
    for (let i = 0; i <= (req.body.audioBitrateLR.length - 1); i++) {
        if (req.body.lossRateIPPackets[0] > 100 || req.body.lossRateIPPackets[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 0 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'AAC-LC' && req.body.audioCodec[0] != 'AAC-HEv1' && 
                req.body.audioCodec[0] != 'AAC-HEv2' && req.body.audioCodec[0] != 'AMR-NB' && req.body.audioCodec[0] != 'AMR-WB+'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        }else {
            var A_BR = req.body.audioBitrateLR[i],//audioBitrateLR
            AudioFrameLength = req.body.audioFrameLength[0],//audioFrameLength
            IPPacketAverageBurstLength = req.body.averageBurstIP[0], // averageBurstIP
            MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[0],
            IPpacketLossRate = req.body.lossRateIPPackets[0], // lossRateIPPackets
            NumberofAudioFramesperPacket = req.body.numAudioFrames[0], // numAudioFrames
            audioCodec = req.body.audioCodec[0] ;
            
            if (audioCodec == 'AAC-LC'){
                var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
            }else if (audioCodec == 'AAC-HEv1'){
                var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
            }else if (audioCodec == 'AAC-HEv2'){
                var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
            }else if (audioCodec == 'AMR-NB'){
                var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
            }else if (audioCodec == 'AMR-WB+'){
                var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
            }
            
            var A_MT = 1;
            var A_ABPLL = IPPacketAverageBurstLength;
            var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
            var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
            var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
            if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
                var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
            } else{
                var A_LFL = A_PLEF * AudioFrameLength;
            }
                
            var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
            var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
            
            A_MOS[i] = 1 + ((A_MOSC -1)*MA);    
        }    
    }
        
    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingLRFrameLengthSA_post = function(req,res){
    var A_MOS = [];
    for (let i = 0; i <= (req.body.audioFrameLength.length - 1); i++) {
        if (req.body.lossRateIPPackets[0] > 100 || req.body.lossRateIPPackets[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 0 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'AAC-LC' && req.body.audioCodec[0] != 'AAC-HEv1' && 
                req.body.audioCodec[0] != 'AAC-HEv2' && req.body.audioCodec[0] != 'AMR-NB' && req.body.audioCodec[0] != 'AMR-WB+'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        }else {
            var A_BR = req.body.audioBitrateLR[0],//audioBitrateLR
            AudioFrameLength = req.body.audioFrameLength[i],//audioFrameLength
            IPPacketAverageBurstLength = req.body.averageBurstIP[0], // averageBurstIP
            MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[0],
            IPpacketLossRate = req.body.lossRateIPPackets[0], // lossRateIPPackets
            NumberofAudioFramesperPacket = req.body.numAudioFrames[0], // numAudioFrames
            audioCodec = req.body.audioCodec[0] ;
            
            if (audioCodec == 'AAC-LC'){
                var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
            }else if (audioCodec == 'AAC-HEv1'){
                var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
            }else if (audioCodec == 'AAC-HEv2'){
                var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
            }else if (audioCodec == 'AMR-NB'){
                var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
            }else if (audioCodec == 'AMR-WB+'){
                var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
            }
            
            var A_MT = 1;
            var A_ABPLL = IPPacketAverageBurstLength;
            var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
            var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
            var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
            if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
                var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
            } else{
                var A_LFL = A_PLEF * AudioFrameLength;
            }
                
            var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
            var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
            
            A_MOS[i] = 1 + ((A_MOSC -1)*MA);    
        }    
    }
        
    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingLRAverageBurstSA_post = function(req,res){
    var A_MOS = [];
    for (let i = 0; i <= (req.body.averageBurstIP.length - 1); i++) {
        if (req.body.lossRateIPPackets[0] > 100 || req.body.lossRateIPPackets[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 0 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'AAC-LC' && req.body.audioCodec[0] != 'AAC-HEv1' && 
                req.body.audioCodec[0] != 'AAC-HEv2' && req.body.audioCodec[0] != 'AMR-NB' && req.body.audioCodec[0] != 'AMR-WB+'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        }else {
            var A_BR = req.body.audioBitrateLR[0],//audioBitrateLR
            AudioFrameLength = req.body.audioFrameLength[0],//audioFrameLength
            IPPacketAverageBurstLength = req.body.averageBurstIP[i], // averageBurstIP
            MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[0],
            IPpacketLossRate = req.body.lossRateIPPackets[0], // lossRateIPPackets
            NumberofAudioFramesperPacket = req.body.numAudioFrames[0], // numAudioFrames
            audioCodec = req.body.audioCodec[0] ;
            
            if (audioCodec == 'AAC-LC'){
                var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
            }else if (audioCodec == 'AAC-HEv1'){
                var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
            }else if (audioCodec == 'AAC-HEv2'){
                var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
            }else if (audioCodec == 'AMR-NB'){
                var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
            }else if (audioCodec == 'AMR-WB+'){
                var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
            }
            
            var A_MT = 1;
            var A_ABPLL = IPPacketAverageBurstLength;
            var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
            var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
            var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
            if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
                var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
            } else{
                var A_LFL = A_PLEF * AudioFrameLength;
            }
                
            var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
            var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
            
            A_MOS[i] = 1 + ((A_MOSC -1)*MA);    
        }    
    }
        
    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingLRAudioStreamSA_post = function(req,res){
    var A_MOS = [];
    for (let i = 0; i <= (req.body.maxSizeAudioStream.length - 1); i++) {
        if (req.body.lossRateIPPackets[0] > 100 || req.body.lossRateIPPackets[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 0 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'AAC-LC' && req.body.audioCodec[0] != 'AAC-HEv1' && 
                req.body.audioCodec[0] != 'AAC-HEv2' && req.body.audioCodec[0] != 'AMR-NB' && req.body.audioCodec[0] != 'AMR-WB+'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        }else {
            var A_BR = req.body.audioBitrateLR[0],//audioBitrateLR
            AudioFrameLength = req.body.audioFrameLength[0],//audioFrameLength
            IPPacketAverageBurstLength = req.body.averageBurstIP[0], // averageBurstIP
            MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[i],
            IPpacketLossRate = req.body.lossRateIPPackets[0], // lossRateIPPackets
            NumberofAudioFramesperPacket = req.body.numAudioFrames[0], // numAudioFrames
            audioCodec = req.body.audioCodec[0] ;
            
            if (audioCodec == 'AAC-LC'){
                var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
            }else if (audioCodec == 'AAC-HEv1'){
                var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
            }else if (audioCodec == 'AAC-HEv2'){
                var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
            }else if (audioCodec == 'AMR-NB'){
                var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
            }else if (audioCodec == 'AMR-WB+'){
                var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
            }
            
            var A_MT = 1;
            var A_ABPLL = IPPacketAverageBurstLength;
            var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
            var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
            var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
            if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
                var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
            } else{
                var A_LFL = A_PLEF * AudioFrameLength;
            }
                
            var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
            var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
            
            A_MOS[i] = 1 + ((A_MOSC -1)*MA);    
        }    
    }
        
    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingLRLossRateSA_post = function(req,res){
    var A_MOS = [];
    for (let i = 0; i <= (req.body.lossRateIPPackets.length - 1); i++) {
        if (req.body.lossRateIPPackets[i] > 100 || req.body.lossRateIPPackets[i] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 0 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'AAC-LC' && req.body.audioCodec[0] != 'AAC-HEv1' && 
                req.body.audioCodec[0] != 'AAC-HEv2' && req.body.audioCodec[0] != 'AMR-NB' && req.body.audioCodec[0] != 'AMR-WB+'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        }else {
            var A_BR = req.body.audioBitrateLR[0],//audioBitrateLR
            AudioFrameLength = req.body.audioFrameLength[0],//audioFrameLength
            IPPacketAverageBurstLength = req.body.averageBurstIP[0], // averageBurstIP
            MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[0],
            IPpacketLossRate = req.body.lossRateIPPackets[i], // lossRateIPPackets
            NumberofAudioFramesperPacket = req.body.numAudioFrames[0], // numAudioFrames
            audioCodec = req.body.audioCodec[0] ;
            
            if (audioCodec == 'AAC-LC'){
                var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
            }else if (audioCodec == 'AAC-HEv1'){
                var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
            }else if (audioCodec == 'AAC-HEv2'){
                var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
            }else if (audioCodec == 'AMR-NB'){
                var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
            }else if (audioCodec == 'AMR-WB+'){
                var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
            }
            
            var A_MT = 1;
            var A_ABPLL = IPPacketAverageBurstLength;
            var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
            var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
            var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
            if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
                var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
            } else{
                var A_LFL = A_PLEF * AudioFrameLength;
            }
                
            var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
            var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
            
            A_MOS[i] = 1 + ((A_MOSC -1)*MA);    
        }    
    }
        
    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingLRAudioFramesSA_post = function(req,res){
    var A_MOS = [];
    for (let i = 0; i <= (req.body.numAudioFrames.length - 1); i++) {
        if (req.body.lossRateIPPackets[0] > 100 || req.body.lossRateIPPackets[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 0 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[0] != 'AAC-LC' && req.body.audioCodec[0] != 'AAC-HEv1' && 
                req.body.audioCodec[0] != 'AAC-HEv2' && req.body.audioCodec[0] != 'AMR-NB' && req.body.audioCodec[0] != 'AMR-WB+'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        }else {
            var A_BR = req.body.audioBitrateLR[0],//audioBitrateLR
            AudioFrameLength = req.body.audioFrameLength[0],//audioFrameLength
            IPPacketAverageBurstLength = req.body.averageBurstIP[0], // averageBurstIP
            MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[0],
            IPpacketLossRate = req.body.lossRateIPPackets[0], // lossRateIPPackets
            NumberofAudioFramesperPacket = req.body.numAudioFrames[i], // numAudioFrames
            audioCodec = req.body.audioCodec[0] ;
            
            if (audioCodec == 'AAC-LC'){
                var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
            }else if (audioCodec == 'AAC-HEv1'){
                var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
            }else if (audioCodec == 'AAC-HEv2'){
                var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
            }else if (audioCodec == 'AMR-NB'){
                var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
            }else if (audioCodec == 'AMR-WB+'){
                var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
            }
            
            var A_MT = 1;
            var A_ABPLL = IPPacketAverageBurstLength;
            var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
            var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
            var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
            if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
                var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
            } else{
                var A_LFL = A_PLEF * AudioFrameLength;
            }
                
            var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
            var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
            
            A_MOS[i] = 1 + ((A_MOSC -1)*MA);    
        }    
    }
        
    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.AudioStreamingLRAudioCodecSA_post = function(req,res){
    var A_MOS = [];
    for (let i = 0; i <= (req.body.audioCodec.length - 1); i++) {
        if (req.body.lossRateIPPackets[0] > 100 || req.body.lossRateIPPackets[0] < 0){
            return res.status(400).json({
                message: 'RTP Packet Loss should be between 0 and 100'
            }); //Bad Request
        }else if(req.body.audioCodec[i] != 'AAC-LC' && req.body.audioCodec[i] != 'AAC-HEv1' && 
                req.body.audioCodec[i] != 'AAC-HEv2' && req.body.audioCodec[i] != 'AMR-NB' && req.body.audioCodec[i] != 'AMR-WB+'){
            return res.status(400).json({
                message: 'Enter a valid Audio Codec from table'
            }); //Bad Request
        }else {
            var A_BR = req.body.audioBitrateLR[0],//audioBitrateLR
            AudioFrameLength = req.body.audioFrameLength[0],//audioFrameLength
            IPPacketAverageBurstLength = req.body.averageBurstIP[0], // averageBurstIP
            MaximumofDataSizeperPacket = req.body.maxSizeAudioStream[0],
            IPpacketLossRate = req.body.lossRateIPPackets[0], // lossRateIPPackets
            NumberofAudioFramesperPacket = req.body.numAudioFrames[0], // numAudioFrames
            audioCodec = req.body.audioCodec[i] ;
            
            if (audioCodec == 'AAC-LC'){
                var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
            }else if (audioCodec == 'AAC-HEv1'){
                var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
            }else if (audioCodec == 'AAC-HEv2'){
                var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
            }else if (audioCodec == 'AMR-NB'){
                var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
            }else if (audioCodec == 'AMR-WB+'){
                var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
            }
            
            var A_MT = 1;
            var A_ABPLL = IPPacketAverageBurstLength;
            var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
            var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
            var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
            if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
                var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
            } else{
                var A_LFL = A_PLEF * AudioFrameLength;
            }
                
            var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
            var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));
            
            A_MOS[i] = 1 + ((A_MOSC -1)*MA);    
        }    
    }
        
    (new AudioStreamingLR({'username': req.params.username , 'audioBitrateLR': req.body.audioBitrateLR, 
    'audioFrameLength':req.body.audioFrameLength, 'averageBurstIP': req.body.averageBurstIP, 'maxSizeAudioStream':req.body.maxSizeAudioStream,
    'lossRateIPPackets': req.body.lossRateIPPackets, 'numAudioFrames':req.body.numAudioFrames, 'audioCodec':req.body.audioCodec,
    'idASLR':getID(), 'mosASLR':A_MOS}))
    .save()
    .then(function(audioStreamingLR){
        res.send(audioStreamingLR);
    }).catch(error => {console.log(error)});
};