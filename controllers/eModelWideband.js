const EModelWideband = require('../models/eModelWideband');
const getID = require("../middleware/generateID");

exports.EmodeleWideband_post = function(req,res){
    if (req.body.packetLossProb > 100 || req.body.packetLossProb < 0){
        return res.status(400).json({
            message: 'Packet-Loss Probabilty should be between 0 and 100'
        }); //Bad Request
    }else{
        var T = req.body.meanOneWayDelay, // round Trip Delay
        Ppl = req.body.packetLossProb, // packet Loss Probability
        TELR = req.body.talkerEchoLoudRating, // talker Echo Loudness Rating
        Ie_WB = req.body.equipmentImpairment, // equipment Impairment Factor
        Ta = req.body.absoluteDelay, // absolute Delay
        Tr = req.body.roundTripDelay, // round Trip Delay
        WEPL = req.body.weightedEchoPathLoss, // weighted Echo Path Loss
        Bpl = req.body.packetLossRobustness; // packetLossRobuestnessFactor
        
        var Ro_WB = 129;
        var Is_WB= 0;
        
        var Id_WB;
        var Idd;
        if (Ta <= 100){
            Idd = 0;
        } else if (Ta > 100){
            var X = Math.log(Ta/100)/Math.log(2);
            Idd = 25*1.29*((1+X**6)**1/6 - 3*(1+(X/3)**6)**(1/6) + 2);
        }
        
        var Rle = 10.5*(WEPL+7)*(Tr+1)**(0.25);
        var Idel_WB = (Ro_WB - Rle)/2 + (((Ro_WB - Rle)**2)/4 + 169)**(0.5);
        
        if (T < 100){
            K = 0.08*T + 100;
        }else if (T >= 100){
            K = 18;
        }
        TERV_WB = TELR + K -40*Math.log((1+(T/10))/(1+(T/150))) + 6*Math.exp(-0.3*T**2);
        var Re_WB = 80 + 3*(TERV_WB - 14);
        
        var Pre = 35+ 10*Math.log(1+10**((10-18)/10));
        var Nor = 2 - 121 + Pre + 0.008*(Pre-35)**2;
        var No_WB = 10 * Math.log(10**(-70/10) + 10**((35 - 8 - 3 - 100 + 0.004*(35-10-3-14)**2)/10) + 10**(Nor/10) + 10**((-96 + 2)/10))
        
        Roe = -1.5*(No_WB - 2);
        var Idte_WB = ((Roe-Re_WB)/2 + (((Roe-Re_WB)**2)/4 + 100)**(0.5) + 1)*(1-Math.exp(-T));
        
        Id_WB = Idte_WB + Idel_WB + Idd;
        
        var Ieeff_WB;
        Ieeff_WB = Ie_WB + (95-Ie_WB)*(Ppl/(Ppl+Bpl));
        
        var A = 0;
        
        R = Ro_WB - Is_WB - Id_WB - Ieeff_WB + A;
        
        var Rx = R/1.29;
        var MOS;
        if (Rx <= 0){
            MOS = 1;
        } else if (Rx > 0 && Rx < 100){
            MOS = 1 + 0.035*Rx + Rx*(Rx-60)*(100-Rx)*7*10**(-6);
        } else if (Rx >= 100){
            MOS = 4.5;
        }
    }

    (new EModelWideband({'username': req.params.username , 'meanOneWayDelay': req.body.meanOneWayDelay, 'packetLossProb':req.body.packetLossProb,
    'talkerEchoLoudRating': req.body.talkerEchoLoudRating, 'equipmentImpairment':req.body.equipmentImpairment, 
    'absoluteDelay': req.body.absoluteDelay, 'roundTripDelay' : req.body.roundTripDelay, 'weightedEchoPathLoss':req.body.weightedEchoPathLoss, 
    'packetLossRobustness': req.body.packetLossRobustness, 'idEMW':getID(), 'mosEMW':MOS }))
    .save()
    .then(function(eModelWideband){
        res.send(eModelWideband);
    }).catch(error => {console.log(error)});
}