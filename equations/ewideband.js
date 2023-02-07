var T = 0, // round Trip Delay
Ppl = 0, // packet Loss Probability
TELR = 65, // talker Echo Loudness Rating
Ie_WB = 0, // equipment Impairment Factor
Ta = 0, // absolute Delay
Tr = 0, // round Trip Delay
WEPL = 110, // weighted Echo Path Loss
Bpl = 4.3; // packetLossRobuestnessFactor

var e =  2.718;

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
TERV_WB = TELR + K -40*Math.log((1+(T/10))/(1+(T/150))) + 6*Math.pow(e, (-0.3*T**2));
var Re_WB = 80 + 3*(TERV_WB - 14);

var Pre = 35+ 10*Math.log(1+10**((10-18)/10));
var Nor = 2 - 121 + Pre + 0.008*(Pre-35)**2;
var No_WB = 10 * Math.log(10**(-70/10) + 10**((35 - 8 - 3 - 100 + 0.004*(35-10-3-14)**2)/10) + 10**(Nor/10) + 10**((-96 + 2)/10))

Roe = -1.5*(No_WB - 2);
var Idte_WB = ((Roe-Re_WB)/2 + (((Roe-Re_WB)**2)/4 + 100)**(0.5) + 1)*(1-Math.pow(e,-T));

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
console.log(MOS);