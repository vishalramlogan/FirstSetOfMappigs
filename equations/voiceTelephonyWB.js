var Ts = 100, // speechDelayNB
Ppls = 1, // speechPacketLossRateNB
TELR = 40 , //talkerEchoLoudnessNB 
IesWB = 1, // Equipment Impairment Factor
Bpls = 4.3; // Packet-Loss Robustness Factor


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
console.log(Sq)