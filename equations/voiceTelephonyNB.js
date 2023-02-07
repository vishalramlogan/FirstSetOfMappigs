var Ts = 95, // speechDelayNB
Ppls = 1, // speechPacketLossRateNB
TELR = 40 , //talkerEchoLoudnessNB 
combination = 1; // combination

if (combination == 1){
    var Ies = 15;
    var Bpls = 16.1;
} else if (combination == 2){
    var Ies = 11;
    var Bpls = 19;
} else if (combination == 3){
    var Ies = 5;
    var Bpls = 10;
} else if (combination == 4){
    var Ies = 0;
    var Bpls = 4.3;
} else if (combination == 5){
    var Ies = 0;
    var Bpls = 25.1;
} else if (combination == 6){
    var Ies = 4;
    var Bpls = 8.1;
} else if (combination == 7){
    var Ies = 0;
    var Bpls = 4.8;
}

var Ieeff = Ies + (95 - Ies) * (Ppls/(Ppls+Bpls));

var TERV = TELR - 40 * Math.log10((1 + Ts/10)/(1 + Ts/150)) + 6*Math.exp(-0.3*(Ts**2));
var Re = 80 + 2.5*(TERV - 14);
var Idte = (((94.769-Re)/2)+((((94.769-Re)**2)/4)+100)**(0.5)-1) * (1 - Math.exp(-Ts));
var Q = 93.193 - Idte - Ieeff;

var Sq;
if (Q < 0){
    Sq = 1;
} else if (Q>0 && Q<100){
    Sq = 1 + 0.035*Q + Q*(Q-60)*(100-Q)*(7*(10**(-6)));
} else if (Q>100){
    Sq = 4.5;
}
console.log(Sq)