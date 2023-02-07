const EModelFullband = require('../models/eModelFullband');
const getID = require("../middleware/generateID");

exports.EModelFullband_post = function(req,res){
    if (req.body.packetLossProb > 100 || req.body.packetLossProb < 0){
        return res.status(400).json({
            message: 'Packet-Loss Probabilty should be between 0 and 100'
        }); //Bad Request
    }else{
        var Ta = req.body.absoluteDelay, // absolute delay 
        Ppl = req.body.packetLossProb, //packet Loss Probability
        Ie_FB =  req.body.equipmentImpairmentFac, // equipment Impairment Factor
        Bpl = req.body.packetLossImpairmentFac; //packet Loss Robustness Factor
        
        var Ro_FB = 148;
        var Is_FB = 0;
        
        var Id_FB;
        if (Ta <= 100){
            Id_FB = 0;
        } else if (Ta > 100){
            var X = Math.log(Ta/100)/Math.log(2);
            Id_FB = 1.48 * 25*((1+X**6)**(1/6) - 3*(1+(X/3)**6)**(1/6) + 2);
        }
        
        var Ieeff_FB;
        Ieeff_FB = Ie_FB + (132 - Ie_FB)*(Ppl/(Ppl+Bpl))
        
        A = 0;
        
        R = Ro_FB - Is_FB - Id_FB - Ieeff_FB + A;
        
        var Rx = R/1.48;
        var MOS;
        if (Rx <= 0){
            MOS = 1;
        } else if (Rx > 0 && Rx < 100){
            MOS = 1 + 0.035*Rx + Rx*(Rx-60)*(100-Rx)*7*10**(-6);
        } else if (Rx >= 100){
            MOS = 4.5;
        }
    }

    (new EModelFullband({'username': req.params.username , 'absoluteDelay': req.body.absoluteDelay, 'packetLossProb':req.body.packetLossProb,
    'equipmentImpairmentFac': req.body.equipmentImpairmentFac, 'packetLossImpairmentFac':req.body.packetLossImpairmentFac, 
    'idEMF': getID(), 'mosEMF': MOS }))
    .save()
    .then(function(eModelFullband){
        res.send(eModelFullband);
    }).catch(error => {console.log(error)});
}