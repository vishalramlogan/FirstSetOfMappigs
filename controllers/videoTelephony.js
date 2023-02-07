const VideoTelephony = require('../models/videoTelephony');
const getID = require("../middleware/generateID");

exports.VideoTelephony_post = function(req,res){
    if (req.body.videoPacketLoss[0] > 10){
        return res.status(400).json({
            message: 'Video Packet-Loss Rate should be less than 10%'
        }); //Bad Request
    }else if(req.body.videoFrameRate[0] > 30 || req.body.videoFrameRate[0] < 1){
        return res.status(400).json({
            message: 'Video Frame Rate should between 1 to 30'
        }); //Bad Request
    }else if(req.body.combinationVT[0] > 21 || req.body.combinationVT[0] < 1){
        return res.status(400).json({
            message: 'Video Frame Rate should between 1 to 30'
        }); //Bad Request
    }else{
        var Pplv = req.body.videoPacketLoss[0], // videoPacketLoss
        Frv = req.body.videoFrameRate[0], //videoFrameRate
        Brv =req.body.videoBitRate[0], // videoBitRate
        combinationVT = req.body.combinationVT[0];
    
        if (combinationVT == 1){
            var v1 = 1.431,v2 = 2.228*10**(-2), v3 = 3.759, v4 = 184.1, v5 = 1.161, v6 = 1.446,
            v7 = 3.881*10**(-4), v8 = 2.116, v9 = 467.4, v10 = 2.736, v11 = 15.28, v12 = 4.170;
        } else if (combinationVT == 2){
            var v1 = 7.160,v2 = 2.215*10**(-2), v3 = 3.461, v4 = 111.9, v5 = 2.091, v6 = 1.382,
            v7 = 5.881*10**(-4), v8 = 0.8401, v9 = 113.9, v10 = 6.047, v11 = 46.87, v12 = 10.87;
        }else if (combinationVT == 3){
            var v1 = 4.78,v2 = 1.22*10**(-2), v3 = 2.614, v4 = 51.68, v5 = 1.063, v6 = 0.898,
            v7 = 6.923*10**(-4), v8 = 0.7846, v9 = 85.15, v10 = 1.32, v11 = 539.48, v12 = 356.6;
        }else if (combinationVT == 4){
            var v1 = 1.182,v2 = 1.11*10**(-2), v3 = 4.286, v4 = 607.86, v5 = 1.184, v6 = 2.738,
            v7 = -9.98*10**(-4), v8 = 0.896, v9 = 187.24, v10 = 5.212, v11 = 254.11, v12 = 268.24;
        }else if (combinationVT == 5){
            var v1 = 5.517,v2 = 1.29*10**(-2), v3 = 3.459, v4 = 178.53, v5 = 1.02, v6 = 1.15,
            v7 = 3.55*10**(-4), v8 = 0.114, v9 = 513.77, v10 = 0.736, v11 =-6.451 , v12 = 13.684;
        }else if (combinationVT == 6){
            var v1 = 6.743,v2 = 0.9998*10**(-2), v3 = 3.051, v4 = 168.1, v5 = 1.766, v6 = 1.130,
            v7 = 18.340*10**(-4), v8 = 1.232, v9 = 53.25, v10 = 3.353, v11 = 6.025, v12 = 80.752;
        }else if (combinationVT == 7){
            var v1 = 3.854,v2 = 1.2010*10**(-2), v3 = 3.240, v4 = 206.3, v5 = 1.681, v6 = 1.624,
            v7 = 6.443*10**(-4), v8 = 1.580, v9 = 208.34, v10 = 4.672, v11 = 7.874, v12 = 15.114;
        }else if (combinationVT == 8){
            var v1 = 2.040,v2 = 1.0991*10**(-2), v3 = 3.593, v4 = 296.2, v5 = 1.322, v6 = 1.683,
            v7 = 4.297*10**(-4), v8 = 1.324, v9 = 102.00, v10 = 3.363, v11 = 18.534, v12 = 96.237;
        }else if (combinationVT == 9){
            var v1 = 1.711,v2 = 0.8978*10**(-2), v3 = 4.283, v4 = 513.2, v5 = 0.850, v6 = 1.392,
            v7 = 2.517*10**(-4), v8 = 1.254, v9 = 307.35, v10 = 1.847, v11 = 17.460, v12 = 3.999;
        }else if (combinationVT == 10){
            var v1 = 5.610,v2 = 1.0113*10**(-2), v3 = 3.379, v4 = 182.3, v5 = 1.310, v6 = 2.230,
            v7 = 7.512*10**(-4), v8 = 1.511, v9 = 136.21, v10 = 4.053, v11 = 20.162, v12 = 22.332;
        }else if (combinationVT == 11){
            var v1 = 6.964,v2 = 0.7019*10**(-2), v3 = 3.582, v4 = 214.1, v5 = 1.200, v6 = 1.755,
            v7 = 6.348*10**(-4), v8 = 1.134, v9 = 170.99, v10 = 4.250, v11 = 7.982, v12 = 12.001;
        }else if (combinationVT == 12){
            var v1 = 6.311,v2 = 0.8123*10**(-2), v3 = 3.681, v4 = 262.04, v5 = 1.280, v6 = 1.973,
            v7 = 3.332*10**(-4), v8 = 1.244, v9 = 343.33, v10 = 2.762, v11 = 6.251, v12 = 6.013;
        }else if (combinationVT == 13){
            var v1 = 2.773,v2 = 0.8987*10**(-2), v3 = 3.952, v4 = 460.3, v5 = 1.281, v6 = 2.119,
            v7 = 3.234*10**(-4), v8 = 1.282, v9 = 262.44, v10 = 1.981, v11 = 22.839, v12 = 7.999;
        }else if (combinationVT == 14){
            var v1 = 5.643,v2 = 1.042*10**(-2), v3 = 2.862, v4 = 178.2, v5 = 1.972, v6 = 1.263,
            v7 = 11.026*10**(-4), v8 = 1.125, v9 = 49.34, v10 = 3.047, v11 = 5.824, v12 = 92.465;
        }else if (combinationVT == 15){
            var v1 = 3.813,v2 = 1.120*10**(-2), v3 = 3.058, v4 = 250.2, v5 = 1.859, v6 = 1.369,
            v7 = 9.324*10**(-4), v8 = 1.368, v9 = 112.0, v10 = 3.564, v11 = 6.875, v12 = 25.977;
        }else if (combinationVT == 16){
            var v1 = 1.849,v2 = 1.060*10**(-2), v3 = 3.281, v4 = 306.4, v5 = 1.607, v6 = 1.858,
            v7 = 4.324*10**(-4), v8 = 1.121, v9 = 168.5, v10 = 2.449, v11 = 15.286, v12 = 9.888;
        }else if (combinationVT == 17){
            var v1 = 1.238,v2 = 0.921*10**(-2), v3 = 3.724, v4 = 364.2, v5 = 1.043, v6 = 1.378,
            v7 = 3.461*10**(-4), v8 = 1.344, v9 = 252.4, v10 = 1.365, v11 = 16.318, v12 = 2.015;
        }else if (combinationVT == 18){
            var v1 = 4.623,v2 = 0.7214*10**(-2), v3 = 3.243, v4 = 193.5, v5 = 1.271, v6 = 1.977,
            v7 = 13.245*10**(-4), v8 = 1.477, v9 = 141.3, v10 = 3.464, v11 = 14.315, v12 = 18.225;
        }else if (combinationVT == 19){
            var v1 = 5.277,v2 = 0.8876*10**(-2), v3 = 3.384, v4 = 238.2, v5 = 1.216, v6 = 1.686,
            v7 = 9.122*10**(-4), v8 = 1.221, v9 = 228.5, v10 = 4.434, v11 = 8.562, v12 = 9.998;
        }else if (combinationVT == 20){
            var v1 = 5.891,v2 = 0.9086*10**(-2), v3 = 3.535, v4 = 222.8, v5 = 1.209, v6 = 1.875,
            v7 = 2.031*10**(-4), v8 = 1.409, v9 = 283.6, v10 = 2.764, v11 = 5.871, v12 = 6.110;
        }else if (combinationVT == 21){
            var v1 = 2.209,v2 = 0.6834*10**(-2), v3 = 3.622, v4 = 312.1, v5 = 1.167, v6 = 1.577,
            v7 = 3.786*10**(-4), v8 = 1.322, v9 = 362.4, v10 = 1.486, v11 = 7.964, v12 = 2.122;
        }
        
        var Dpplv = v10 + v11*Math.exp(-Frv/v8) + v12*Math.exp(-Brv/v9);
        
        var Dfrv = v6 + (v7*Brv);
        var Ofr = v1 + v2*Brv;
        var Iofr = v3 - ((v3)/(1 + (Brv/v4)**v5))
        if (Frv == Ofr){
            var Icoding = Iofr;
        } else{
            var Icoding = Iofr * Math.exp(-((Math.log(Frv)-Math.log(Ofr))**2)/(2*(Dfrv**2)));
        }
        
        var Vq = 1 + Icoding * Math.exp(-Pplv/Dpplv);    
    }
        
    (new VideoTelephony({'username': req.params.username , 'videoPacketLoss': req.body.videoPacketLoss,
    'videoFrameRate':req.body.videoFrameRate,
    'videoBitRate': req.body.videoBitRate, 'combinationVT':req.body.combinationVT, 
    'idVT':getID(), 'mosVT':Vq }))
    .save()
    .then(function(videoTelephony){
        res.send(videoTelephony);
    }).catch(error => {console.log(error)});
};

exports.VideoTelephonyPacketLossSA_post = function(req,res){
    var Vq = [];
    for (let i = 0; i <= (req.body.videoPacketLoss.length - 1); i++) {
        if (req.body.videoPacketLoss[i] > 10){
            return res.status(400).json({
                message: 'Video Packet-Loss Rate should be less than 10%'
            }); //Bad Request
        }else if(req.body.videoFrameRate[0] > 30 || req.body.videoFrameRate[0] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        }else if(req.body.combinationVT[0] > 21 || req.body.combinationVT[0] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        } else{
            var Pplv = req.body.videoPacketLoss[i], // videoPacketLoss
            Frv = req.body.videoFrameRate[0], //videoFrameRate
            Brv =req.body.videoBitRate[0], // videoBitRate
            combinationVT = req.body.combinationVT[0];
        
            if (combinationVT == 1){
                var v1 = 1.431,v2 = 2.228*10**(-2), v3 = 3.759, v4 = 184.1, v5 = 1.161, v6 = 1.446,
                v7 = 3.881*10**(-4), v8 = 2.116, v9 = 467.4, v10 = 2.736, v11 = 15.28, v12 = 4.170;
            } else if (combinationVT == 2){
                var v1 = 7.160,v2 = 2.215*10**(-2), v3 = 3.461, v4 = 111.9, v5 = 2.091, v6 = 1.382,
                v7 = 5.881*10**(-4), v8 = 0.8401, v9 = 113.9, v10 = 6.047, v11 = 46.87, v12 = 10.87;
            }else if (combinationVT == 3){
                var v1 = 4.78,v2 = 1.22*10**(-2), v3 = 2.614, v4 = 51.68, v5 = 1.063, v6 = 0.898,
                v7 = 6.923*10**(-4), v8 = 0.7846, v9 = 85.15, v10 = 1.32, v11 = 539.48, v12 = 356.6;
            }else if (combinationVT == 4){
                var v1 = 1.182,v2 = 1.11*10**(-2), v3 = 4.286, v4 = 607.86, v5 = 1.184, v6 = 2.738,
                v7 = -9.98*10**(-4), v8 = 0.896, v9 = 187.24, v10 = 5.212, v11 = 254.11, v12 = 268.24;
            }else if (combinationVT == 5){
                var v1 = 5.517,v2 = 1.29*10**(-2), v3 = 3.459, v4 = 178.53, v5 = 1.02, v6 = 1.15,
                v7 = 3.55*10**(-4), v8 = 0.114, v9 = 513.77, v10 = 0.736, v11 =-6.451 , v12 = 13.684;
            }else if (combinationVT == 6){
                var v1 = 6.743,v2 = 0.9998*10**(-2), v3 = 3.051, v4 = 168.1, v5 = 1.766, v6 = 1.130,
                v7 = 18.340*10**(-4), v8 = 1.232, v9 = 53.25, v10 = 3.353, v11 = 6.025, v12 = 80.752;
            }else if (combinationVT == 7){
                var v1 = 3.854,v2 = 1.2010*10**(-2), v3 = 3.240, v4 = 206.3, v5 = 1.681, v6 = 1.624,
                v7 = 6.443*10**(-4), v8 = 1.580, v9 = 208.34, v10 = 4.672, v11 = 7.874, v12 = 15.114;
            }else if (combinationVT == 8){
                var v1 = 2.040,v2 = 1.0991*10**(-2), v3 = 3.593, v4 = 296.2, v5 = 1.322, v6 = 1.683,
                v7 = 4.297*10**(-4), v8 = 1.324, v9 = 102.00, v10 = 3.363, v11 = 18.534, v12 = 96.237;
            }else if (combinationVT == 9){
                var v1 = 1.711,v2 = 0.8978*10**(-2), v3 = 4.283, v4 = 513.2, v5 = 0.850, v6 = 1.392,
                v7 = 2.517*10**(-4), v8 = 1.254, v9 = 307.35, v10 = 1.847, v11 = 17.460, v12 = 3.999;
            }else if (combinationVT == 10){
                var v1 = 5.610,v2 = 1.0113*10**(-2), v3 = 3.379, v4 = 182.3, v5 = 1.310, v6 = 2.230,
                v7 = 7.512*10**(-4), v8 = 1.511, v9 = 136.21, v10 = 4.053, v11 = 20.162, v12 = 22.332;
            }else if (combinationVT == 11){
                var v1 = 6.964,v2 = 0.7019*10**(-2), v3 = 3.582, v4 = 214.1, v5 = 1.200, v6 = 1.755,
                v7 = 6.348*10**(-4), v8 = 1.134, v9 = 170.99, v10 = 4.250, v11 = 7.982, v12 = 12.001;
            }else if (combinationVT == 12){
                var v1 = 6.311,v2 = 0.8123*10**(-2), v3 = 3.681, v4 = 262.04, v5 = 1.280, v6 = 1.973,
                v7 = 3.332*10**(-4), v8 = 1.244, v9 = 343.33, v10 = 2.762, v11 = 6.251, v12 = 6.013;
            }else if (combinationVT == 13){
                var v1 = 2.773,v2 = 0.8987*10**(-2), v3 = 3.952, v4 = 460.3, v5 = 1.281, v6 = 2.119,
                v7 = 3.234*10**(-4), v8 = 1.282, v9 = 262.44, v10 = 1.981, v11 = 22.839, v12 = 7.999;
            }else if (combinationVT == 14){
                var v1 = 5.643,v2 = 1.042*10**(-2), v3 = 2.862, v4 = 178.2, v5 = 1.972, v6 = 1.263,
                v7 = 11.026*10**(-4), v8 = 1.125, v9 = 49.34, v10 = 3.047, v11 = 5.824, v12 = 92.465;
            }else if (combinationVT == 15){
                var v1 = 3.813,v2 = 1.120*10**(-2), v3 = 3.058, v4 = 250.2, v5 = 1.859, v6 = 1.369,
                v7 = 9.324*10**(-4), v8 = 1.368, v9 = 112.0, v10 = 3.564, v11 = 6.875, v12 = 25.977;
            }else if (combinationVT == 16){
                var v1 = 1.849,v2 = 1.060*10**(-2), v3 = 3.281, v4 = 306.4, v5 = 1.607, v6 = 1.858,
                v7 = 4.324*10**(-4), v8 = 1.121, v9 = 168.5, v10 = 2.449, v11 = 15.286, v12 = 9.888;
            }else if (combinationVT == 17){
                var v1 = 1.238,v2 = 0.921*10**(-2), v3 = 3.724, v4 = 364.2, v5 = 1.043, v6 = 1.378,
                v7 = 3.461*10**(-4), v8 = 1.344, v9 = 252.4, v10 = 1.365, v11 = 16.318, v12 = 2.015;
            }else if (combinationVT == 18){
                var v1 = 4.623,v2 = 0.7214*10**(-2), v3 = 3.243, v4 = 193.5, v5 = 1.271, v6 = 1.977,
                v7 = 13.245*10**(-4), v8 = 1.477, v9 = 141.3, v10 = 3.464, v11 = 14.315, v12 = 18.225;
            }else if (combinationVT == 19){
                var v1 = 5.277,v2 = 0.8876*10**(-2), v3 = 3.384, v4 = 238.2, v5 = 1.216, v6 = 1.686,
                v7 = 9.122*10**(-4), v8 = 1.221, v9 = 228.5, v10 = 4.434, v11 = 8.562, v12 = 9.998;
            }else if (combinationVT == 20){
                var v1 = 5.891,v2 = 0.9086*10**(-2), v3 = 3.535, v4 = 222.8, v5 = 1.209, v6 = 1.875,
                v7 = 2.031*10**(-4), v8 = 1.409, v9 = 283.6, v10 = 2.764, v11 = 5.871, v12 = 6.110;
            }else if (combinationVT == 21){
                var v1 = 2.209,v2 = 0.6834*10**(-2), v3 = 3.622, v4 = 312.1, v5 = 1.167, v6 = 1.577,
                v7 = 3.786*10**(-4), v8 = 1.322, v9 = 362.4, v10 = 1.486, v11 = 7.964, v12 = 2.122;
            }
            
            var Dpplv = v10 + v11*Math.exp(-Frv/v8) + v12*Math.exp(-Brv/v9);
            
            var Dfrv = v6 + (v7*Brv);
            var Ofr = v1 + v2*Brv;
            var Iofr = v3 - ((v3)/(1 + (Brv/v4)**v5))
            if (Frv == Ofr){
                var Icoding = Iofr;
            } else{
                var Icoding = Iofr * Math.exp(-((Math.log(Frv)-Math.log(Ofr))**2)/(2*(Dfrv**2)));
            }
            
            Vq[i] = 1 + Icoding * Math.exp(-Pplv/Dpplv);    
        }
    }
            
    (new VideoTelephony({'username': req.params.username , 'videoPacketLoss': req.body.videoPacketLoss,
    'videoFrameRate':req.body.videoFrameRate,
    'videoBitRate': req.body.videoBitRate, 'combinationVT':req.body.combinationVT, 
    'idVT':getID(), 'mosVT':Vq }))
    .save()
    .then(function(videoTelephony){
        res.send(videoTelephony);
    }).catch(error => {console.log(error)});
};

exports.VideoTelephonyFrameRateSA_post = function(req,res){
    var Vq = [];
    for (let i = 0; i <= (req.body.videoFrameRate.length - 1); i++) {
        if (req.body.videoPacketLoss[0] > 10){
            return res.status(400).json({
                message: 'Video Packet-Loss Rate should be less than 10%'
            }); //Bad Request
        }else if(req.body.videoFrameRate[i] > 30 || req.body.videoFrameRate[i] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        }else if(req.body.combinationVT[0] > 21 || req.body.combinationVT[0] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        } else{
            var Pplv = req.body.videoPacketLoss[0], // videoPacketLoss
            Frv = req.body.videoFrameRate[i], //videoFrameRate
            Brv =req.body.videoBitRate[0], // videoBitRate
            combinationVT = req.body.combinationVT[0];
        
            if (combinationVT == 1){
                var v1 = 1.431,v2 = 2.228*10**(-2), v3 = 3.759, v4 = 184.1, v5 = 1.161, v6 = 1.446,
                v7 = 3.881*10**(-4), v8 = 2.116, v9 = 467.4, v10 = 2.736, v11 = 15.28, v12 = 4.170;
            } else if (combinationVT == 2){
                var v1 = 7.160,v2 = 2.215*10**(-2), v3 = 3.461, v4 = 111.9, v5 = 2.091, v6 = 1.382,
                v7 = 5.881*10**(-4), v8 = 0.8401, v9 = 113.9, v10 = 6.047, v11 = 46.87, v12 = 10.87;
            }else if (combinationVT == 3){
                var v1 = 4.78,v2 = 1.22*10**(-2), v3 = 2.614, v4 = 51.68, v5 = 1.063, v6 = 0.898,
                v7 = 6.923*10**(-4), v8 = 0.7846, v9 = 85.15, v10 = 1.32, v11 = 539.48, v12 = 356.6;
            }else if (combinationVT == 4){
                var v1 = 1.182,v2 = 1.11*10**(-2), v3 = 4.286, v4 = 607.86, v5 = 1.184, v6 = 2.738,
                v7 = -9.98*10**(-4), v8 = 0.896, v9 = 187.24, v10 = 5.212, v11 = 254.11, v12 = 268.24;
            }else if (combinationVT == 5){
                var v1 = 5.517,v2 = 1.29*10**(-2), v3 = 3.459, v4 = 178.53, v5 = 1.02, v6 = 1.15,
                v7 = 3.55*10**(-4), v8 = 0.114, v9 = 513.77, v10 = 0.736, v11 =-6.451 , v12 = 13.684;
            }else if (combinationVT == 6){
                var v1 = 6.743,v2 = 0.9998*10**(-2), v3 = 3.051, v4 = 168.1, v5 = 1.766, v6 = 1.130,
                v7 = 18.340*10**(-4), v8 = 1.232, v9 = 53.25, v10 = 3.353, v11 = 6.025, v12 = 80.752;
            }else if (combinationVT == 7){
                var v1 = 3.854,v2 = 1.2010*10**(-2), v3 = 3.240, v4 = 206.3, v5 = 1.681, v6 = 1.624,
                v7 = 6.443*10**(-4), v8 = 1.580, v9 = 208.34, v10 = 4.672, v11 = 7.874, v12 = 15.114;
            }else if (combinationVT == 8){
                var v1 = 2.040,v2 = 1.0991*10**(-2), v3 = 3.593, v4 = 296.2, v5 = 1.322, v6 = 1.683,
                v7 = 4.297*10**(-4), v8 = 1.324, v9 = 102.00, v10 = 3.363, v11 = 18.534, v12 = 96.237;
            }else if (combinationVT == 9){
                var v1 = 1.711,v2 = 0.8978*10**(-2), v3 = 4.283, v4 = 513.2, v5 = 0.850, v6 = 1.392,
                v7 = 2.517*10**(-4), v8 = 1.254, v9 = 307.35, v10 = 1.847, v11 = 17.460, v12 = 3.999;
            }else if (combinationVT == 10){
                var v1 = 5.610,v2 = 1.0113*10**(-2), v3 = 3.379, v4 = 182.3, v5 = 1.310, v6 = 2.230,
                v7 = 7.512*10**(-4), v8 = 1.511, v9 = 136.21, v10 = 4.053, v11 = 20.162, v12 = 22.332;
            }else if (combinationVT == 11){
                var v1 = 6.964,v2 = 0.7019*10**(-2), v3 = 3.582, v4 = 214.1, v5 = 1.200, v6 = 1.755,
                v7 = 6.348*10**(-4), v8 = 1.134, v9 = 170.99, v10 = 4.250, v11 = 7.982, v12 = 12.001;
            }else if (combinationVT == 12){
                var v1 = 6.311,v2 = 0.8123*10**(-2), v3 = 3.681, v4 = 262.04, v5 = 1.280, v6 = 1.973,
                v7 = 3.332*10**(-4), v8 = 1.244, v9 = 343.33, v10 = 2.762, v11 = 6.251, v12 = 6.013;
            }else if (combinationVT == 13){
                var v1 = 2.773,v2 = 0.8987*10**(-2), v3 = 3.952, v4 = 460.3, v5 = 1.281, v6 = 2.119,
                v7 = 3.234*10**(-4), v8 = 1.282, v9 = 262.44, v10 = 1.981, v11 = 22.839, v12 = 7.999;
            }else if (combinationVT == 14){
                var v1 = 5.643,v2 = 1.042*10**(-2), v3 = 2.862, v4 = 178.2, v5 = 1.972, v6 = 1.263,
                v7 = 11.026*10**(-4), v8 = 1.125, v9 = 49.34, v10 = 3.047, v11 = 5.824, v12 = 92.465;
            }else if (combinationVT == 15){
                var v1 = 3.813,v2 = 1.120*10**(-2), v3 = 3.058, v4 = 250.2, v5 = 1.859, v6 = 1.369,
                v7 = 9.324*10**(-4), v8 = 1.368, v9 = 112.0, v10 = 3.564, v11 = 6.875, v12 = 25.977;
            }else if (combinationVT == 16){
                var v1 = 1.849,v2 = 1.060*10**(-2), v3 = 3.281, v4 = 306.4, v5 = 1.607, v6 = 1.858,
                v7 = 4.324*10**(-4), v8 = 1.121, v9 = 168.5, v10 = 2.449, v11 = 15.286, v12 = 9.888;
            }else if (combinationVT == 17){
                var v1 = 1.238,v2 = 0.921*10**(-2), v3 = 3.724, v4 = 364.2, v5 = 1.043, v6 = 1.378,
                v7 = 3.461*10**(-4), v8 = 1.344, v9 = 252.4, v10 = 1.365, v11 = 16.318, v12 = 2.015;
            }else if (combinationVT == 18){
                var v1 = 4.623,v2 = 0.7214*10**(-2), v3 = 3.243, v4 = 193.5, v5 = 1.271, v6 = 1.977,
                v7 = 13.245*10**(-4), v8 = 1.477, v9 = 141.3, v10 = 3.464, v11 = 14.315, v12 = 18.225;
            }else if (combinationVT == 19){
                var v1 = 5.277,v2 = 0.8876*10**(-2), v3 = 3.384, v4 = 238.2, v5 = 1.216, v6 = 1.686,
                v7 = 9.122*10**(-4), v8 = 1.221, v9 = 228.5, v10 = 4.434, v11 = 8.562, v12 = 9.998;
            }else if (combinationVT == 20){
                var v1 = 5.891,v2 = 0.9086*10**(-2), v3 = 3.535, v4 = 222.8, v5 = 1.209, v6 = 1.875,
                v7 = 2.031*10**(-4), v8 = 1.409, v9 = 283.6, v10 = 2.764, v11 = 5.871, v12 = 6.110;
            }else if (combinationVT == 21){
                var v1 = 2.209,v2 = 0.6834*10**(-2), v3 = 3.622, v4 = 312.1, v5 = 1.167, v6 = 1.577,
                v7 = 3.786*10**(-4), v8 = 1.322, v9 = 362.4, v10 = 1.486, v11 = 7.964, v12 = 2.122;
            }
            
            var Dpplv = v10 + v11*Math.exp(-Frv/v8) + v12*Math.exp(-Brv/v9);
            
            var Dfrv = v6 + (v7*Brv);
            var Ofr = v1 + v2*Brv;
            var Iofr = v3 - ((v3)/(1 + (Brv/v4)**v5))
            if (Frv == Ofr){
                var Icoding = Iofr;
            } else{
                var Icoding = Iofr * Math.exp(-((Math.log(Frv)-Math.log(Ofr))**2)/(2*(Dfrv**2)));
            }
            
            Vq[i] = 1 + Icoding * Math.exp(-Pplv/Dpplv);    
        }
    }
            
    (new VideoTelephony({'username': req.params.username , 'videoPacketLoss': req.body.videoPacketLoss,
    'videoFrameRate':req.body.videoFrameRate,
    'videoBitRate': req.body.videoBitRate, 'combinationVT':req.body.combinationVT, 
    'idVT':getID(), 'mosVT':Vq }))
    .save()
    .then(function(videoTelephony){
        res.send(videoTelephony);
    }).catch(error => {console.log(error)});
};

exports.VideoTelephonyBitRateSA_post = function(req,res){
    var Vq = [];
    for (let i = 0; i <= (req.body.videoBitRate.length - 1); i++) {
        if (req.body.videoPacketLoss[0] > 10){
            return res.status(400).json({
                message: 'Video Packet-Loss Rate should be less than 10%'
            }); //Bad Request
        }else if(req.body.videoFrameRate[0] > 30 || req.body.videoFrameRate[0] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        }else if(req.body.combinationVT[0] > 21 || req.body.combinationVT[0] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        } else{
            var Pplv = req.body.videoPacketLoss[0], // videoPacketLoss
            Frv = req.body.videoFrameRate[0], //videoFrameRate
            Brv =req.body.videoBitRate[i], // videoBitRate
            combinationVT = req.body.combinationVT[0];
        
            if (combinationVT == 1){
                var v1 = 1.431,v2 = 2.228*10**(-2), v3 = 3.759, v4 = 184.1, v5 = 1.161, v6 = 1.446,
                v7 = 3.881*10**(-4), v8 = 2.116, v9 = 467.4, v10 = 2.736, v11 = 15.28, v12 = 4.170;
            } else if (combinationVT == 2){
                var v1 = 7.160,v2 = 2.215*10**(-2), v3 = 3.461, v4 = 111.9, v5 = 2.091, v6 = 1.382,
                v7 = 5.881*10**(-4), v8 = 0.8401, v9 = 113.9, v10 = 6.047, v11 = 46.87, v12 = 10.87;
            }else if (combinationVT == 3){
                var v1 = 4.78,v2 = 1.22*10**(-2), v3 = 2.614, v4 = 51.68, v5 = 1.063, v6 = 0.898,
                v7 = 6.923*10**(-4), v8 = 0.7846, v9 = 85.15, v10 = 1.32, v11 = 539.48, v12 = 356.6;
            }else if (combinationVT == 4){
                var v1 = 1.182,v2 = 1.11*10**(-2), v3 = 4.286, v4 = 607.86, v5 = 1.184, v6 = 2.738,
                v7 = -9.98*10**(-4), v8 = 0.896, v9 = 187.24, v10 = 5.212, v11 = 254.11, v12 = 268.24;
            }else if (combinationVT == 5){
                var v1 = 5.517,v2 = 1.29*10**(-2), v3 = 3.459, v4 = 178.53, v5 = 1.02, v6 = 1.15,
                v7 = 3.55*10**(-4), v8 = 0.114, v9 = 513.77, v10 = 0.736, v11 =-6.451 , v12 = 13.684;
            }else if (combinationVT == 6){
                var v1 = 6.743,v2 = 0.9998*10**(-2), v3 = 3.051, v4 = 168.1, v5 = 1.766, v6 = 1.130,
                v7 = 18.340*10**(-4), v8 = 1.232, v9 = 53.25, v10 = 3.353, v11 = 6.025, v12 = 80.752;
            }else if (combinationVT == 7){
                var v1 = 3.854,v2 = 1.2010*10**(-2), v3 = 3.240, v4 = 206.3, v5 = 1.681, v6 = 1.624,
                v7 = 6.443*10**(-4), v8 = 1.580, v9 = 208.34, v10 = 4.672, v11 = 7.874, v12 = 15.114;
            }else if (combinationVT == 8){
                var v1 = 2.040,v2 = 1.0991*10**(-2), v3 = 3.593, v4 = 296.2, v5 = 1.322, v6 = 1.683,
                v7 = 4.297*10**(-4), v8 = 1.324, v9 = 102.00, v10 = 3.363, v11 = 18.534, v12 = 96.237;
            }else if (combinationVT == 9){
                var v1 = 1.711,v2 = 0.8978*10**(-2), v3 = 4.283, v4 = 513.2, v5 = 0.850, v6 = 1.392,
                v7 = 2.517*10**(-4), v8 = 1.254, v9 = 307.35, v10 = 1.847, v11 = 17.460, v12 = 3.999;
            }else if (combinationVT == 10){
                var v1 = 5.610,v2 = 1.0113*10**(-2), v3 = 3.379, v4 = 182.3, v5 = 1.310, v6 = 2.230,
                v7 = 7.512*10**(-4), v8 = 1.511, v9 = 136.21, v10 = 4.053, v11 = 20.162, v12 = 22.332;
            }else if (combinationVT == 11){
                var v1 = 6.964,v2 = 0.7019*10**(-2), v3 = 3.582, v4 = 214.1, v5 = 1.200, v6 = 1.755,
                v7 = 6.348*10**(-4), v8 = 1.134, v9 = 170.99, v10 = 4.250, v11 = 7.982, v12 = 12.001;
            }else if (combinationVT == 12){
                var v1 = 6.311,v2 = 0.8123*10**(-2), v3 = 3.681, v4 = 262.04, v5 = 1.280, v6 = 1.973,
                v7 = 3.332*10**(-4), v8 = 1.244, v9 = 343.33, v10 = 2.762, v11 = 6.251, v12 = 6.013;
            }else if (combinationVT == 13){
                var v1 = 2.773,v2 = 0.8987*10**(-2), v3 = 3.952, v4 = 460.3, v5 = 1.281, v6 = 2.119,
                v7 = 3.234*10**(-4), v8 = 1.282, v9 = 262.44, v10 = 1.981, v11 = 22.839, v12 = 7.999;
            }else if (combinationVT == 14){
                var v1 = 5.643,v2 = 1.042*10**(-2), v3 = 2.862, v4 = 178.2, v5 = 1.972, v6 = 1.263,
                v7 = 11.026*10**(-4), v8 = 1.125, v9 = 49.34, v10 = 3.047, v11 = 5.824, v12 = 92.465;
            }else if (combinationVT == 15){
                var v1 = 3.813,v2 = 1.120*10**(-2), v3 = 3.058, v4 = 250.2, v5 = 1.859, v6 = 1.369,
                v7 = 9.324*10**(-4), v8 = 1.368, v9 = 112.0, v10 = 3.564, v11 = 6.875, v12 = 25.977;
            }else if (combinationVT == 16){
                var v1 = 1.849,v2 = 1.060*10**(-2), v3 = 3.281, v4 = 306.4, v5 = 1.607, v6 = 1.858,
                v7 = 4.324*10**(-4), v8 = 1.121, v9 = 168.5, v10 = 2.449, v11 = 15.286, v12 = 9.888;
            }else if (combinationVT == 17){
                var v1 = 1.238,v2 = 0.921*10**(-2), v3 = 3.724, v4 = 364.2, v5 = 1.043, v6 = 1.378,
                v7 = 3.461*10**(-4), v8 = 1.344, v9 = 252.4, v10 = 1.365, v11 = 16.318, v12 = 2.015;
            }else if (combinationVT == 18){
                var v1 = 4.623,v2 = 0.7214*10**(-2), v3 = 3.243, v4 = 193.5, v5 = 1.271, v6 = 1.977,
                v7 = 13.245*10**(-4), v8 = 1.477, v9 = 141.3, v10 = 3.464, v11 = 14.315, v12 = 18.225;
            }else if (combinationVT == 19){
                var v1 = 5.277,v2 = 0.8876*10**(-2), v3 = 3.384, v4 = 238.2, v5 = 1.216, v6 = 1.686,
                v7 = 9.122*10**(-4), v8 = 1.221, v9 = 228.5, v10 = 4.434, v11 = 8.562, v12 = 9.998;
            }else if (combinationVT == 20){
                var v1 = 5.891,v2 = 0.9086*10**(-2), v3 = 3.535, v4 = 222.8, v5 = 1.209, v6 = 1.875,
                v7 = 2.031*10**(-4), v8 = 1.409, v9 = 283.6, v10 = 2.764, v11 = 5.871, v12 = 6.110;
            }else if (combinationVT == 21){
                var v1 = 2.209,v2 = 0.6834*10**(-2), v3 = 3.622, v4 = 312.1, v5 = 1.167, v6 = 1.577,
                v7 = 3.786*10**(-4), v8 = 1.322, v9 = 362.4, v10 = 1.486, v11 = 7.964, v12 = 2.122;
            }
            
            var Dpplv = v10 + v11*Math.exp(-Frv/v8) + v12*Math.exp(-Brv/v9);
            
            var Dfrv = v6 + (v7*Brv);
            var Ofr = v1 + v2*Brv;
            var Iofr = v3 - ((v3)/(1 + (Brv/v4)**v5))
            if (Frv == Ofr){
                var Icoding = Iofr;
            } else{
                var Icoding = Iofr * Math.exp(-((Math.log(Frv)-Math.log(Ofr))**2)/(2*(Dfrv**2)));
            }
            
            Vq[i] = 1 + Icoding * Math.exp(-Pplv/Dpplv);    
        }
    }
            
    (new VideoTelephony({'username': req.params.username , 'videoPacketLoss': req.body.videoPacketLoss,
    'videoFrameRate':req.body.videoFrameRate,
    'videoBitRate': req.body.videoBitRate, 'combinationVT':req.body.combinationVT, 
    'idVT':getID(), 'mosVT':Vq }))
    .save()
    .then(function(videoTelephony){
        res.send(videoTelephony);
    }).catch(error => {console.log(error)});
};

exports.VideoTelephonyCombinationSA_post = function(req,res){
    var Vq = [];
    for (let i = 0; i <= (req.body.combinationVT.length - 1); i++) {
        if (req.body.videoPacketLoss[0] > 10){
            return res.status(400).json({
                message: 'Video Packet-Loss Rate should be less than 10%'
            }); //Bad Request
        }else if(req.body.videoFrameRate[0] > 30 || req.body.videoFrameRate[0] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        }else if(req.body.combinationVT[i] > 21 || req.body.combinationVT[i] < 1){
            return res.status(400).json({
                message: 'Video Frame Rate should between 1 to 30'
            }); //Bad Request
        } else{
            var Pplv = req.body.videoPacketLoss[0], // videoPacketLoss
            Frv = req.body.videoFrameRate[0], //videoFrameRate
            Brv =req.body.videoBitRate[0], // videoBitRate
            combinationVT = req.body.combinationVT[i];
        
            if (combinationVT == 1){
                var v1 = 1.431,v2 = 2.228*10**(-2), v3 = 3.759, v4 = 184.1, v5 = 1.161, v6 = 1.446,
                v7 = 3.881*10**(-4), v8 = 2.116, v9 = 467.4, v10 = 2.736, v11 = 15.28, v12 = 4.170;
            } else if (combinationVT == 2){
                var v1 = 7.160,v2 = 2.215*10**(-2), v3 = 3.461, v4 = 111.9, v5 = 2.091, v6 = 1.382,
                v7 = 5.881*10**(-4), v8 = 0.8401, v9 = 113.9, v10 = 6.047, v11 = 46.87, v12 = 10.87;
            }else if (combinationVT == 3){
                var v1 = 4.78,v2 = 1.22*10**(-2), v3 = 2.614, v4 = 51.68, v5 = 1.063, v6 = 0.898,
                v7 = 6.923*10**(-4), v8 = 0.7846, v9 = 85.15, v10 = 1.32, v11 = 539.48, v12 = 356.6;
            }else if (combinationVT == 4){
                var v1 = 1.182,v2 = 1.11*10**(-2), v3 = 4.286, v4 = 607.86, v5 = 1.184, v6 = 2.738,
                v7 = -9.98*10**(-4), v8 = 0.896, v9 = 187.24, v10 = 5.212, v11 = 254.11, v12 = 268.24;
            }else if (combinationVT == 5){
                var v1 = 5.517,v2 = 1.29*10**(-2), v3 = 3.459, v4 = 178.53, v5 = 1.02, v6 = 1.15,
                v7 = 3.55*10**(-4), v8 = 0.114, v9 = 513.77, v10 = 0.736, v11 =-6.451 , v12 = 13.684;
            }else if (combinationVT == 6){
                var v1 = 6.743,v2 = 0.9998*10**(-2), v3 = 3.051, v4 = 168.1, v5 = 1.766, v6 = 1.130,
                v7 = 18.340*10**(-4), v8 = 1.232, v9 = 53.25, v10 = 3.353, v11 = 6.025, v12 = 80.752;
            }else if (combinationVT == 7){
                var v1 = 3.854,v2 = 1.2010*10**(-2), v3 = 3.240, v4 = 206.3, v5 = 1.681, v6 = 1.624,
                v7 = 6.443*10**(-4), v8 = 1.580, v9 = 208.34, v10 = 4.672, v11 = 7.874, v12 = 15.114;
            }else if (combinationVT == 8){
                var v1 = 2.040,v2 = 1.0991*10**(-2), v3 = 3.593, v4 = 296.2, v5 = 1.322, v6 = 1.683,
                v7 = 4.297*10**(-4), v8 = 1.324, v9 = 102.00, v10 = 3.363, v11 = 18.534, v12 = 96.237;
            }else if (combinationVT == 9){
                var v1 = 1.711,v2 = 0.8978*10**(-2), v3 = 4.283, v4 = 513.2, v5 = 0.850, v6 = 1.392,
                v7 = 2.517*10**(-4), v8 = 1.254, v9 = 307.35, v10 = 1.847, v11 = 17.460, v12 = 3.999;
            }else if (combinationVT == 10){
                var v1 = 5.610,v2 = 1.0113*10**(-2), v3 = 3.379, v4 = 182.3, v5 = 1.310, v6 = 2.230,
                v7 = 7.512*10**(-4), v8 = 1.511, v9 = 136.21, v10 = 4.053, v11 = 20.162, v12 = 22.332;
            }else if (combinationVT == 11){
                var v1 = 6.964,v2 = 0.7019*10**(-2), v3 = 3.582, v4 = 214.1, v5 = 1.200, v6 = 1.755,
                v7 = 6.348*10**(-4), v8 = 1.134, v9 = 170.99, v10 = 4.250, v11 = 7.982, v12 = 12.001;
            }else if (combinationVT == 12){
                var v1 = 6.311,v2 = 0.8123*10**(-2), v3 = 3.681, v4 = 262.04, v5 = 1.280, v6 = 1.973,
                v7 = 3.332*10**(-4), v8 = 1.244, v9 = 343.33, v10 = 2.762, v11 = 6.251, v12 = 6.013;
            }else if (combinationVT == 13){
                var v1 = 2.773,v2 = 0.8987*10**(-2), v3 = 3.952, v4 = 460.3, v5 = 1.281, v6 = 2.119,
                v7 = 3.234*10**(-4), v8 = 1.282, v9 = 262.44, v10 = 1.981, v11 = 22.839, v12 = 7.999;
            }else if (combinationVT == 14){
                var v1 = 5.643,v2 = 1.042*10**(-2), v3 = 2.862, v4 = 178.2, v5 = 1.972, v6 = 1.263,
                v7 = 11.026*10**(-4), v8 = 1.125, v9 = 49.34, v10 = 3.047, v11 = 5.824, v12 = 92.465;
            }else if (combinationVT == 15){
                var v1 = 3.813,v2 = 1.120*10**(-2), v3 = 3.058, v4 = 250.2, v5 = 1.859, v6 = 1.369,
                v7 = 9.324*10**(-4), v8 = 1.368, v9 = 112.0, v10 = 3.564, v11 = 6.875, v12 = 25.977;
            }else if (combinationVT == 16){
                var v1 = 1.849,v2 = 1.060*10**(-2), v3 = 3.281, v4 = 306.4, v5 = 1.607, v6 = 1.858,
                v7 = 4.324*10**(-4), v8 = 1.121, v9 = 168.5, v10 = 2.449, v11 = 15.286, v12 = 9.888;
            }else if (combinationVT == 17){
                var v1 = 1.238,v2 = 0.921*10**(-2), v3 = 3.724, v4 = 364.2, v5 = 1.043, v6 = 1.378,
                v7 = 3.461*10**(-4), v8 = 1.344, v9 = 252.4, v10 = 1.365, v11 = 16.318, v12 = 2.015;
            }else if (combinationVT == 18){
                var v1 = 4.623,v2 = 0.7214*10**(-2), v3 = 3.243, v4 = 193.5, v5 = 1.271, v6 = 1.977,
                v7 = 13.245*10**(-4), v8 = 1.477, v9 = 141.3, v10 = 3.464, v11 = 14.315, v12 = 18.225;
            }else if (combinationVT == 19){
                var v1 = 5.277,v2 = 0.8876*10**(-2), v3 = 3.384, v4 = 238.2, v5 = 1.216, v6 = 1.686,
                v7 = 9.122*10**(-4), v8 = 1.221, v9 = 228.5, v10 = 4.434, v11 = 8.562, v12 = 9.998;
            }else if (combinationVT == 20){
                var v1 = 5.891,v2 = 0.9086*10**(-2), v3 = 3.535, v4 = 222.8, v5 = 1.209, v6 = 1.875,
                v7 = 2.031*10**(-4), v8 = 1.409, v9 = 283.6, v10 = 2.764, v11 = 5.871, v12 = 6.110;
            }else if (combinationVT == 21){
                var v1 = 2.209,v2 = 0.6834*10**(-2), v3 = 3.622, v4 = 312.1, v5 = 1.167, v6 = 1.577,
                v7 = 3.786*10**(-4), v8 = 1.322, v9 = 362.4, v10 = 1.486, v11 = 7.964, v12 = 2.122;
            }
            
            var Dpplv = v10 + v11*Math.exp(-Frv/v8) + v12*Math.exp(-Brv/v9);
            
            var Dfrv = v6 + (v7*Brv);
            var Ofr = v1 + v2*Brv;
            var Iofr = v3 - ((v3)/(1 + (Brv/v4)**v5))
            if (Frv == Ofr){
                var Icoding = Iofr;
            } else{
                var Icoding = Iofr * Math.exp(-((Math.log(Frv)-Math.log(Ofr))**2)/(2*(Dfrv**2)));
            }
            
            Vq[i] = 1 + Icoding * Math.exp(-Pplv/Dpplv);    
        }
    }
            
    (new VideoTelephony({'username': req.params.username , 'videoPacketLoss': req.body.videoPacketLoss,
    'videoFrameRate':req.body.videoFrameRate,
    'videoBitRate': req.body.videoBitRate, 'combinationVT':req.body.combinationVT, 
    'idVT':getID(), 'mosVT':Vq }))
    .save()
    .then(function(videoTelephony){
        res.send(videoTelephony);
    }).catch(error => {console.log(error)});
};