const VideoStreamingHR = require('../models/videoStreamingHR');
const getID = require("../middleware/generateID");

exports.VideoStreamingHR_post =function(req,res){
    if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
        return res.status(400).json({
            message: 'Slice/Frame must be less than or equal to 1'
        }); //Bad Request
    }else if(req.body.videoPLC[0]  != 'slicing' && req.body.videoPLC[0]  != 'freezing'){
        return res.status(400).json({
            message: 'VideoPLC must be either Slicing or Freezing'
        }); //Bad Request
    }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
        return res.status(400).json({
            message: 'Video resolution must be HD or SD'
        }); //Bad Request
    }else{
        var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
        videoResolution = req.body.videoResolution[0] ,
        sliceFrame = req.body.sliceFrame[0] ,
        BitrateV =req.body.videoBitrate[0] , //videoBitrate
        FrameRate = req.body.frameRate[0] ,
        videoPLC = req.body.videoPLC[0] ,
        FreezingRatio = req.body.freezingRatio[0] ,
        LossMagnitude = req.body.lossMagnitude[0] ;
         
        if (videoResolution == 'SD'){
            var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
            a31 = 0.91, a32 = -9.39, a33 = 0.10,
            p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
        
        } else if (videoResolution == 'HD'){
            var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
            a31 = 3.92, a32 = -27.54, a33 = 0.26,
            p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
        }
        
        if (sliceFrame == 1){
            var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
        } else {
            var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
        }
        
        var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
        var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
        var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
        
        if (videoPLC == 'freezing'){
            var FreezingRatioE = FreezingRatio*BitPerPixel;
            var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
        } else if (videoPLC == 'slicing'){
            if(QcodV < 20){
                var QcodVn = 1;
            } else{
                var QcodVn = (0.1125*QcodV) - 1.25;
            }
            var LossMagnitudeE = LossMagnitude/QcodVn;
            var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
        }
        var QV = 100 -QcodV - QtraV;
        
        var mos_max = 4.9, mos_min = 1.05;
        if (QV > 0 && QV < 100){
            var MOS = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
        } else if (QV >= 100){
            var MOS = mos_max;
        }else{
            var MOS = mos_min;
        }    
    }
    
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
}

exports.VideoStreamingHRNumPixelsSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.numPixelsPerVideo.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[0]  != 'slicing' && req.body.videoPLC[0]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[i] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[0] ,
            sliceFrame = req.body.sliceFrame[0] ,
            BitrateV =req.body.videoBitrate[0] , //videoBitrate
            FrameRate = req.body.frameRate[0] ,
            videoPLC = req.body.videoPLC[0] ,
            FreezingRatio = req.body.freezingRatio[0] ,
            LossMagnitude = req.body.lossMagnitude[0] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingHRVideoResolutionSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.videoResolution.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[0]  != 'slicing' && req.body.videoPLC[0]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[i]  != 'HD' && req.body.videoResolution[i]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[i] ,
            sliceFrame = req.body.sliceFrame[0] ,
            BitrateV =req.body.videoBitrate[0] , //videoBitrate
            FrameRate = req.body.frameRate[0] ,
            videoPLC = req.body.videoPLC[0] ,
            FreezingRatio = req.body.freezingRatio[0] ,
            LossMagnitude = req.body.lossMagnitude[0] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingHRSliceFrameSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.sliceFrame.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[i]  != 'slicing' && req.body.videoPLC[i]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[0] ,
            sliceFrame = req.body.sliceFrame[i] ,
            BitrateV =req.body.videoBitrate[0] , //videoBitrate
            FrameRate = req.body.frameRate[0] ,
            videoPLC = req.body.videoPLC[0] ,
            FreezingRatio = req.body.freezingRatio[0] ,
            LossMagnitude = req.body.lossMagnitude[0] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingHRVideoBitrateSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.videoBitrate.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[0]  != 'slicing' && req.body.videoPLC[0]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[0] ,
            sliceFrame = req.body.sliceFrame[0] ,
            BitrateV =req.body.videoBitrate[i] , //videoBitrate
            FrameRate = req.body.frameRate[0] ,
            videoPLC = req.body.videoPLC[0] ,
            FreezingRatio = req.body.freezingRatio[0] ,
            LossMagnitude = req.body.lossMagnitude[0] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingHRFrameRateSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.frameRate.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[0]  != 'slicing' && req.body.videoPLC[0]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[0] ,
            sliceFrame = req.body.sliceFrame[0] ,
            BitrateV =req.body.videoBitrate[0] , //videoBitrate
            FrameRate = req.body.frameRate[i] ,
            videoPLC = req.body.videoPLC[0] ,
            FreezingRatio = req.body.freezingRatio[0] ,
            LossMagnitude = req.body.lossMagnitude[0] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingHRVideoPLCSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.videoPLC.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[i]  != 'slicing' && req.body.videoPLC[i]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[0] ,
            sliceFrame = req.body.sliceFrame[0] ,
            BitrateV =req.body.videoBitrate[0] , //videoBitrate
            FrameRate = req.body.frameRate[0] ,
            videoPLC = req.body.videoPLC[i] ,
            FreezingRatio = req.body.freezingRatio[0] ,
            LossMagnitude = req.body.lossMagnitude[0] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingHRFreezingRatioSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.freezingRatio.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[0]  != 'slicing' && req.body.videoPLC[0]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[0] ,
            sliceFrame = req.body.sliceFrame[0] ,
            BitrateV =req.body.videoBitrate[0] , //videoBitrate
            FrameRate = req.body.frameRate[0] ,
            videoPLC = req.body.videoPLC[0] ,
            FreezingRatio = req.body.freezingRatio[i] ,
            LossMagnitude = req.body.lossMagnitude[0] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};

exports.VideoStreamingHRLossMagnitudeSA_post =function(req,res){
    var MOS = [];
    for (let i = 0; i <= (req.body.lossMagnitude.length - 1); i++) {
        if (req.body.sliceFrame[0] > 1 || req.body.sliceFrame[0]  < 0){
            return res.status(400).json({
                message: 'Slice/Frame must be less than or equal to 1'
            }); //Bad Request
        }else if(req.body.videoPLC[0]  != 'slicing' && req.body.videoPLC[0]  != 'freezing'){
            return res.status(400).json({
                message: 'VideoPLC must be either Slicing or Freezing'
            }); //Bad Request
        }else if(req.body.videoResolution[0]  != 'HD' && req.body.videoResolution[0]  != 'SD'){
            return res.status(400).json({
                message: 'Video resolution must be HD or SD'
            }); //Bad Request
        }else{
            var NumPixelsPerFrame =req.body.numPixelsPerVideo[0] , //numPixelsPerVideo
            videoResolution = req.body.videoResolution[0] ,
            sliceFrame = req.body.sliceFrame[0] ,
            BitrateV =req.body.videoBitrate[0] , //videoBitrate
            FrameRate = req.body.frameRate[0] ,
            videoPLC = req.body.videoPLC[0] ,
            FreezingRatio = req.body.freezingRatio[0] ,
            LossMagnitude = req.body.lossMagnitude[i] ;
             
            if (videoResolution == 'SD'){
                var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 0.91, a32 = -9.39, a33 = 0.10,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            
            } else if (videoResolution == 'HD'){
                var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
                a31 = 3.92, a32 = -27.54, a33 = 0.26,
                p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
            }
            
            if (sliceFrame == 1){
                var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
            } else {
                var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
            }
            
            var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
            var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
            var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;
            
            if (videoPLC == 'freezing'){
                var FreezingRatioE = FreezingRatio*BitPerPixel;
                var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
            } else if (videoPLC == 'slicing'){
                if(QcodV < 20){
                    var QcodVn = 1;
                } else{
                    var QcodVn = (0.1125*QcodV) - 1.25;
                }
                var LossMagnitudeE = LossMagnitude/QcodVn;
                var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
            }
            var QV = 100 -QcodV - QtraV;
            
            var mos_max = 4.9, mos_min = 1.05;
            if (QV > 0 && QV < 100){
                MOS[i] = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
            } else if (QV >= 100){
                MOS[i] = mos_max;
            }else{
                MOS[i] = mos_min;
            }    
        }
    }
        
    (new VideoStreamingHR({'username': req.params.username , 'numPixelsPerVideo': req.body.numPixelsPerVideo,
    'videoResolution':req.body.videoResolution,
    'sliceFrame': req.body.sliceFrame, 'frameRate':req.body.frameRate, 
    'videoPLC': req.body.videoPLC, 'videoBitrate':req.body.videoBitrate, 
    'freezingRatio': req.body.freezingRatio, 'lossMagnitude':req.body.lossMagnitude,
    'idVSHR':getID(), 'mosVSHR':MOS}))
    .save()
    .then(function(videoStreamingHR){
        res.send(videoStreamingHR);
    }).catch(error => {console.log(error)});
};