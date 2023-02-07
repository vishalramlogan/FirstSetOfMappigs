const VideoStreamingLR = require('../models/videoStreamingLR');
const getID = require("../middleware/generateID");

exports.VideoStreamingLR_post = function(req,res){
    if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
        return res.status(400).json({
            message: 'Packet Loss must be Yes or No'
        }); //Bad Request
    }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
        return res.status(400).json({
            message: 'Rebuffering must be Yes or No'
        }); //Bad Request
    }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
        return res.status(400).json({
            message: 'Video PLC must be slicing or freezing'
        }); //Bad Request
    }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
        return res.status(400).json({
            message: 'Video Content Complexity must be between 1 and 5'
        }); //Bad Request
    }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
        return res.status(400).json({
            message: 'Other Coding Compression must be between 1 and 6'
        }); //Bad Request
    }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
        return res.status(400).json({
            message: 'IP Packet Loss Rate must be less than 1'
        }); //Bad Request
    }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
        return res.status(400).json({
            message: 'IP Packet Loss normally be less than 1'
        }); //Bad Request
    }else{   
        var packetLoss = req.body.packetLoss[0],
        rebuffering = req.body.rebuffering[0],
        Width = req.body.videoWidth[0], // videoWidth
        Height = req.body.videoHeight[0], //videoHeight
        videoPLC = req.body.videoPLC[0],
        ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
        NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
        MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
        V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
        videoContentCoding = req.body.videoContentCoding[0],
        codingCompression = req.body.codingCompression[0],
        MeasureTime = req.body.measureTime[0], //
        V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
        V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
        GopLength = req.body.gopLength[0], //gopLength
        V_BR = req.body.videoBitrate[0], // videoBitrate
        videoFrameRate = req.body.videoFrameRate[0],
        FrameRate = videoFrameRate,
        TotalFrameNum = MeasureTime*videoFrameRate; 
        
        var MOS_MAX = 5, 
        MOS_MIN = 1;
        
        if (codingCompression == 1){
            var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
            if (videoPLC == 'slicing'){
                var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
            } else if (videoPLC == 'freezing'){
                var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
            }
            var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
        } else if (codingCompression == 2){
            var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
            if (videoPLC == 'slicing'){
                var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
            } else if (videoPLC == 'freezing'){
                var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
            }
            var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
        }else if (codingCompression == 3){
            var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
            if (videoPLC == 'slicing'){
                var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
            } else if (videoPLC == 'freezing'){
                var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
            }
            var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
        }else if (codingCompression == 4){
            var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
            if (videoPLC == 'slicing'){
                var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
            } else if (videoPLC == 'freezing'){
                var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
            }
            var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
        }else if (codingCompression == 5){
            var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
            if (videoPLC == 'slicing'){
                var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
            } else if (videoPLC == 'freezing'){
                var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
            }
            var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
        }else if (codingCompression == 6){
            var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
            if (videoPLC == 'slicing'){
                var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
            } else if (videoPLC == 'freezing'){
                var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
            }
            var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
        }
        
        // V_PLEF
        var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
        if (TotalPktNumtmp < TotalFrameNum){
            var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
        }else {
            var TotalPktNum = TotalPktNumtmp;
        }
        var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
        var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
        var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
        var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
        var V_ratio = V_Burst/V_PktpF;
        if(V_ratio < 1){
            var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
        } else{
            var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
        }
        
        // V_CCF
        if (videoContentCoding == 1){
            var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
        } else if (videoContentCoding == 2){
            var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
        } else if (videoContentCoding == 3){
            var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
        } else if (videoContentCoding == 4){
            var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
        } else if (videoContentCoding == 5){
            var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
        }
        var Threshold = d * Width * Height;
        if (V_BR < Threshold){
            var V_CCF = (a*Math.log(V_BR)) + b;
        }else if (V_BR >= Threshold){
            var V_CCF = c;
        }
        //calculating V_MOSC
        var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
        if (videoFrameRate >= 24){
            var V_MOSC = MOS_MAX - V_DC;
        }else {
            var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
        }
        
        //calculating V_MOSP
        if (videoPLC == 'slicing'){
            var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
            (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
        }else if (videoPLC == 'freezing'){
            var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
            (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
        }
        var V_MOSP = V_MOSC - V_DP;
        
        //calculating V_MOSR
        if (rebuffering == 'Yes' && packetLoss == 'Yes'){
            var Video_Quality = V_MOSP;
        }else {
            var Video_Quality = V_MOSC;
        }
        var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
        (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
        var V_MOSR = Video_Quality - V_DR;
        
        var V_MOS;
        if (packetLoss == 'No' && rebuffering == 'No'){
            V_MOS = V_MOSC;
        }else if (packetLoss == 'Yes' && rebuffering == 'No'){
            V_MOS = V_MOSP;
        }else {
            V_MOS = V_MOSR;
        }
    }
    
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRPacketLossSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.packetLoss.length - 1); i++) {
        if (req.body.packetLoss[i] != 'Yes' && req.body.packetLoss[i] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[i],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRRebufferingSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.rebuffering.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[i] != 'Yes' && req.body.rebuffering[i] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[i],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRVideoWidthSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.videoWidth.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[i], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRVideoHeightSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.videoHeight.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[i], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRVideoPLCSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.videoPLC.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[i] != 'slicing' && req.body.videoPLC[i] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[i],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRRebufferingLengthSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.rebufferingLength.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[i], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRNumRebufferingSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.numRebufferingEvents.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[i], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRRebufferingFactorSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.rebufferingFactor.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[i], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRNumVideosSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.numVideos.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[i], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRVideoContentCodingSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.videoContentCoding.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[i] > 5 || req.body.videoContentCoding[i] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[i],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRCodingCompressionSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.codingCompression.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[i] > 6 || req.body.codingCompression[i] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[i],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRMeasureTimeSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.measureTime.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[i], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRIPPacketLossSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.ipPacketLoss.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[i] > 1 || req.body.ipPacketLoss[i] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[i], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRPacketLossRateSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.ipPacketLossRate.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[i] > 1 || req.body.ipPacketLossRate[i] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[i], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRGOPLengthSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.gopLength.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[i], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRVideoBitrateSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.videoBitrate.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[i], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[0],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingLRVideoFrameRateSA_post = function(req,res){
    var V_MOS = [];
    for (let i = 0; i <= (req.body.videoFrameRate.length - 1); i++) {
        if (req.body.packetLoss[0] != 'Yes' && req.body.packetLoss[0] != 'No'){
            return res.status(400).json({
                message: 'Packet Loss must be Yes or No'
            }); //Bad Request
        }else if (req.body.rebuffering[0] != 'Yes' && req.body.rebuffering[0] != 'No'){
            return res.status(400).json({
                message: 'Rebuffering must be Yes or No'
            }); //Bad Request
        }else if (req.body.videoPLC[0] != 'slicing' && req.body.videoPLC[0] != 'freezing'){
            return res.status(400).json({
                message: 'Video PLC must be slicing or freezing'
            }); //Bad Request
        }else if (req.body.videoContentCoding[0] > 5 || req.body.videoContentCoding[0] < 1){
            return res.status(400).json({
                message: 'Video Content Complexity must be between 1 and 5'
            }); //Bad Request
        }else if (req.body.codingCompression[0] > 6 || req.body.codingCompression[0] < 1){
            return res.status(400).json({
                message: 'Other Coding Compression must be between 1 and 6'
            }); //Bad Request
        }else if (req.body.ipPacketLossRate[0] > 1 || req.body.ipPacketLossRate[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss Rate must be less than 1'
            }); //Bad Request
        }else if (req.body.ipPacketLoss[0] > 1 || req.body.ipPacketLoss[0] < 0){
            return res.status(400).json({
                message: 'IP Packet Loss normally be less than 1'
            }); //Bad Request
        }else{   
            var packetLoss = req.body.packetLoss[0],
            rebuffering = req.body.rebuffering[0],
            Width = req.body.videoWidth[0], // videoWidth
            Height = req.body.videoHeight[0], //videoHeight
            videoPLC = req.body.videoPLC[0],
            ARL = req.body.rebufferingLength[0], //rebufferingLength in seconds
            NRE = req.body.numRebufferingEvents[0], //numRebufferingEvents
            MREEF = req.body.rebufferingFactor[0], // rebufferingFactor
            V_NBR = req.body.numVideos[0], // numVideos or Variable Number of Buffering Events Rate
            videoContentCoding = req.body.videoContentCoding[0],
            codingCompression = req.body.codingCompression[0],
            MeasureTime = req.body.measureTime[0], //
            V_Burst = req.body.ipPacketLoss[0], //ipPacketLoss in seconds (noramlly less than 1)
            V_LossRate = req.body.ipPacketLossRate[0], //ipPacketLossRate (less than 1)
            GopLength = req.body.gopLength[0], //gopLength
            V_BR = req.body.videoBitrate[0], // videoBitrate
            videoFrameRate = req.body.videoFrameRate[i],
            FrameRate = videoFrameRate,
            TotalFrameNum = MeasureTime*videoFrameRate; 
            
            var MOS_MAX = 5, 
            MOS_MIN = 1;
            
            if (codingCompression == 1){
                var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
            } else if (codingCompression == 2){
                var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
                if (videoPLC == 'slicing'){
                    var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
                }
                var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
            }else if (codingCompression == 3){
                var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
                if (videoPLC == 'slicing'){
                    var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
            }else if (codingCompression == 4){
                var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
                }
                var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
            }else if (codingCompression == 5){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
                }
                var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
            }else if (codingCompression == 6){
                var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
                if (videoPLC == 'slicing'){
                    var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
                } else if (videoPLC == 'freezing'){
                    var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
                }
                var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
            }
            
            // V_PLEF
            var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
            if (TotalPktNumtmp < TotalFrameNum){
                var TotalPktNum = TotalFrameNum + TotalPktNumtmp/10;
            }else {
                var TotalPktNum = TotalPktNumtmp;
            }
            var V_PktpF = TotalPktNum/(FrameRate*MeasureTime);
            var V_AIRF = (1/(1-(1-V_LossRate)**V_PktpF))-((1-V_LossRate)/(V_LossRate*V_PktpF));
            var V_LossRateFrame = 1 - (1-V_LossRate)**V_PktpF;
            var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength))*(1-(1-V_LossRateFrame)**GopLength);
            var V_ratio = V_Burst/V_PktpF;
            if(V_ratio < 1){
                var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
            } else{
                var V_PLEF = (TotalPktNum*V_LossRate)/V_PktpF;
            }
            
            // V_CCF
            if (videoContentCoding == 1){
                var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
            } else if (videoContentCoding == 2){
                var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
            } else if (videoContentCoding == 3){
                var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
            } else if (videoContentCoding == 4){
                var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
            } else if (videoContentCoding == 5){
                var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
            }
            var Threshold = d * Width * Height;
            if (V_BR < Threshold){
                var V_CCF = (a*Math.log(V_BR)) + b;
            }else if (V_BR >= Threshold){
                var V_CCF = c;
            }
            //calculating V_MOSC
            var V_DC = (MOS_MAX-MOS_MIN)/(1+((V_NBR)/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
            if (videoFrameRate >= 24){
                var V_MOSC = MOS_MAX - V_DC;
            }else {
                var V_MOSC = (MOS_MAX-V_DC)*(1+ v1*V_CCF - v2*V_CCF*Math.log(1000/videoFrameRate));
            }
            
            //calculating V_MOSP
            if (videoPLC == 'slicing'){
                var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
                (1+((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }else if (videoPLC == 'freezing'){
                var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
                (1+(((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))));
            }
            var V_MOSP = V_MOSC - V_DP;
            
            //calculating V_MOSR
            if (rebuffering == 'Yes' && packetLoss == 'Yes'){
                var Video_Quality = V_MOSP;
            }else {
                var Video_Quality = V_MOSC;
            }
            var V_DR = (Video_Quality-MOS_MIN)*((((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))/
            (1 + (((NRE/v13)**v14) * ((ARL/v15)**v16) * ((MREEF/v17)**v18))));
            var V_MOSR = Video_Quality - V_DR;
            
            if (packetLoss == 'No' && rebuffering == 'No'){
                V_MOS[i] = V_MOSC;
            }else if (packetLoss == 'Yes' && rebuffering == 'No'){
                V_MOS[i] = V_MOSP;
            }else {
                V_MOS[i] = V_MOSR;
            }
        }        
    }
        
    (new VideoStreamingLR({'username': req.params.username , 'packetLoss': req.body.packetLoss,
    'rebuffering':req.body.rebuffering,
    'videoWidth': req.body.videoWidth, 'videoHeight':req.body.videoHeight, 
    'videoPLC': req.body.videoPLC, 'rebufferingLength':req.body.rebufferingLength, 
    'numRebufferingEvents': req.body.numRebufferingEvents, 'rebufferingFactor':req.body.rebufferingFactor,
    'numVideos': req.body.numVideos, 'videoContentCoding':req.body.videoContentCoding,
    'codingCompression': req.body.codingCompression,
    'measureTime': req.body.measureTime, 'ipPacketLoss':req.body.ipPacketLoss,
    'ipPacketLossRate': req.body.ipPacketLossRate, 'gopLength':req.body.gopLength,
    'videoBitrate': req.body.videoBitrate, 'videoFrameRate':req.body.videoFrameRate,
    'idVSLR':getID(), 'mosVSLR':V_MOS}))
    .save()
    .then(function(videoStreamingLR){
        res.send(videoStreamingLR);
    }).catch(error => {console.log(error)});
};