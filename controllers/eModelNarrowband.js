const EModelNarrowband = require('../models/eModelNarrowband');
const getID = require("../middleware/generateID");

exports.EModelNarrowband_post = function(req,res){
    if (req.body.packetLossProb > 100 || req.body.packetLossProb < 0){
        return res.status(400).json({
            message: 'Packet-Loss Probabilty should be between 0 and 100'
        }); //Bad Request
    }else if (req.body.classDelaySensitivity != 'Default' && req.body.classDelaySensitivity != 'Low' && req.body.classDelaySensitivity != 'Very Low'){
        return res.status(400).json({
            message: 'Packet-Loss Probabilty should be between 0 and 100'
        }); //Bad Request
    }else {
        var Nc = req.body.electricCircuitNoise, // electric Cricuti Noise
        Nfor = req.body.noiseFloor, // Noise floor 
        Ps =req.body.roomNoiseS, // room Noise Sender
        Pr =req.body.roomNoiseR, // room Noise Receiver
        SLR =req.body.sLoudnessRating, //sender Loudness Rating
        RLR =req.body.rLoudnessRating, //receiver Loudness Rating
        STMR =req.body.sidetoneMaskingRating, // sidetone Masking Rating 
        Dr =req.body.dFactorR, // d Factor Receiver
        LSTR = (STMR + Dr), // listiner Sidetone Rating SEE If TO REMOVE THIS
        Ds = req.body.dFactorS, // d Factor Sender
        classofDelaySensitivity = req.body.classDelaySensitivity, 
        T = req.body.meanOneWayDelay, // mean One Way Delay
        Ta = req.body.absoluteDelay, // absolute Delay SEE If TO REMOVE THIS
        Tr = req.body.roundTripDelay, // round Trip Delay SEE If TO REMOVE THIS
        TELR =req.body.talkerEchoLoudness, // talker echo Loudness Rating
        WEPL=req.body.weightedEchoPathLoss, //weighted echo Path Loss
        qdu=req.body.qdu, 
        Ie = req.body.equipmentImpairmentFac, // equipment Impairment Factor
        Bpl =req.body.packetLossRobustness, //packet Loss Robustness Factor 
        Ppl =req.body.packetLossProb, // packet Loss Probability
        BurstR =req.body.burstRate,// Burst Ratio
        A = req.body.advantageFactor; // advantage factor
        
        
        var R, Ro, Is, Ieeff, Id; // Calculating R
        var No,Nos,Nor,Nfo,OLR,Pre; // Calculating Ro
        var Iolr,Ist,Iq,Xolr,STMRo,Q,G,Y,Z; // Calculating Is
        var Idte,Idtes,Idle,Idd,TERV,TERVs,Re,Roe,Rle,Ta,mT,sT; // Calculating Id
        
        // Calculation Ro
        Nfo = Nfor + RLR;
        
        Pre = Pr+ 10*Math.log10(1 + 10**((10-LSTR)/10));
        Nor = RLR - 121 + Pre + 0.008*((Pre-35)**2);
        
        OLR = SLR + RLR;
        Nos = Ps - SLR - Ds - 100 + 0.004*((Ps-OLR-Ds-14)**2);
        
        No = 10 * Math.log10(10**(Nc/10) + 10**(Nos/10) + 10**(Nor/10) + 10**(Nfo/10));
        Ro = 15 - 1.5*(SLR + No);
        //console.log(Ro);
        
        // Calculating Is
        Q = 37 - 15*Math.log10(qdu);
        G = 1.07 + 0.258*Q + (0.0602*(Q**2));
        Y = (Ro-100)/15 + (46/8.4) - G/9;
        Z = 46/30 - G/40;
        Iq = 15* Math.log10(1 + 10**Y + 10**Z);
        
        STMRo = -10 * Math.log10(10**(-STMR/10) + (Math.exp(-T/4) * (10**(-TELR/10))));
        Ist = 12*((1+((STMRo-13)/6)**8)**(1/8)) - 28*((1+((STMRo+1)/19.4)**35)**(1/35)) - 13*((1+((STMRo-3)/33)**13)**(1/13)) +29;
        
        Xolr = OLR + 0.2*(64 + No - RLR);
        Iolr = 20*((1 + (Xolr/8)**8)**(1/8) - (Xolr/8));
        
        Is = Iolr + Ist + Iq;
        //console.log(Is);
        
        // Calculating Id
        if(classofDelaySensitivity === 'Default'){
            sT = 1;
            mT = 100;
        }else if(classofDelaySensitivity === 'Low'){
            sT = 0.55;
            mT = 120;
        }else if(classofDelaySensitivity === 'Very Low'){
            sT = 0.4;
            mT = 150;
        }
        
        
        if (T<1){
            Idte = 0;
        }else{
            TERV = TELR - 40*Math.log10((1+T/10)/(1+T/150)) + 6*Math.exp(-0.3*(T**2));
            Roe = -1.5*(No - RLR);
            if(STMR < 9){
                TERVs = TERV + Ist/2;
                Re = 80 + 2.5*(TERVs - 14);
            } else {
                Re = 80 + 2.5*(TERV - 14);
            }
            Idte = (((Roe-Re)/2) + ((((Roe-Re)**2)/4 +100)**(0.5)) - 1)*(1 - Math.exp(-T));
        }
        
        Rle = 10.5*(WEPL+7)*((Tr+1)**(-0.25));
        Idle = ((Ro-Rle)/2) + (((Ro-Rle)**2)/4 + 169)**0.5;
        
        if (Ta <= mT){
            Idd=0;
        }else if (Ta > mT){
            var X = (Math.log10(Ta / mT))/(Math.log10(2));
            Idd = 25*((1+(X**(6*sT)))**(1/(6*sT)) - 3*(1+((X/3)**(6*sT)))**(1/(6*sT)) + 2);
        }
        
        if (STMR > 20){
            Idtes = (Idte**2 + Ist**2)**0.5
            Id = Idtes + Idle + Idd;
        }else {
            Id = Idte + Idle + Idd;
        }
        
        // Calculating Ieeff
        Ieeff = Ie + (95 - Ie)*((Ppl)/((Ppl/BurstR)+Bpl));
        
        // Calculating R
        R = Ro - Is - Id - Ieeff + A;
        var MOS;
        if (R <= 0){
            MOS = 1;
        } else if (R > 0 && R < 100){
            MOS = 1 + 0.035*R + R*(R-60)*(100-R)*7*10**(-6);
        } else if (R >= 100){
            MOS = 4.5;
        }
    }

    (new EModelNarrowband({'username': req.params.username , 'electricCircuitNoise': req.body.electricCircuitNoise, 
    'noiseFloor':req.body.noiseFloor,'roomNoiseS':req.body.roomNoiseS,'roomNoiseR':req.body.roomNoiseR,
    'sLoudnessRating': req.body.sLoudnessRating, 'rLoudnessRating':req.body.rLoudnessRating, 
    'sidetoneMaskingRating': req.body.sidetoneMaskingRating, 'dFactorR':req.body.dFactorR, 
    'listnerSidetoneRating': LSTR, 'dFactorS':req.body.dFactorS, 
    'classDelaySensitivity': req.body.classDelaySensitivity, 'meanOneWayDelay':req.body.meanOneWayDelay, 
    'absoluteDelay': req.body.absoluteDelay, 'roundTripDelay':req.body.roundTripDelay, 
    'talkerEchoLoudness': req.body.talkerEchoLoudness, 'weightedEchoPathLoss':req.body.weightedEchoPathLoss, 
    'qdu': req.body.qdu, 'equipmentImpairmentFac':req.body.equipmentImpairmentFac, 
    'packetLossRobustness': req.body.packetLossRobustness, 'packetLossProb':req.body.packetLossProb, 
    'burstRate': req.body.burstRate, 'advantageFactor': req.body.advantageFactor, 
    'idEMN': getID(), 'mosEMN': MOS }))
    .save()
    .then(function(eModelNarrowband){
        res.send(eModelNarrowband);
    }).catch(error => {console.log(error)});
}