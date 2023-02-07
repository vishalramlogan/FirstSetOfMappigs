
var BitrateA = 96, //audioBitrate
BitrateV  = 4, // videoBitrate
RTPpacketLoss = 1, // rtpPacketLoss
RTPburstiness = 4.3, //rtpPacketLossBurstiness
D = 5, // numRTPPacketsTSPackets
audioCodec = 'Mp2',
burstLengthA = 1;

if(audioCodec === 'Mp2'){
    var a1A = 100.0, a2A = -0.02, a3A = 15.48, b1A = 100.0, b2A = 1.51, b3A = 1.64,
    c1A = 0.006, c2A =1.124, d1A = 0.682, d2A =-0.001 , d3A = 0.908;
}else if (audioCodec === 'AC3'){
    var a1A = 100.0, a2A = -0.03, a3A = 15.70, b1A = 100.0, b2A = 0.2, b3A = 2.40,
    c1A = 0.016, c2A =0.973, d1A =0.277 , d2A =-0.003 , d3A = 0.974;
}else if (audioCodec === 'AacLC'){
    var a1A = 100.0, a2A = -0.05, a3A = 14.60, b1A = 101.32, b2A = 0.1, b3A = 4.09,
    c1A = 0.005, c2A =0.976, d1A =0.486 , d2A =-0.001 , d3A = 0.923;
}else if (audioCodec === 'HeAac'){
    var a1A = 100.0, a2A = -0.11, a3A = 20.06, b1A = 101.32, b2A = 0.1, b3A = 5.92,
    c1A = 0.026, c2A =0.482, d1A =-0.627 , d2A = 0.012, d3A = 0.984;
}

if ((BitrateA/(BitrateV*(10**3))) == (1/(6+(7*D)))){
    var TSpacketLossA = RTPpacketLoss;
    var TSBurstinessA = ((7*BitrateA)/(BitrateV*(10**3) + BitrateA))*burstLengthA*RTPburstiness;
} else{
    var TSpacketLossA = RTPpacketLoss;
    var TSBurstinessA = 7 * RTPburstiness;
}

for (let NTSV = 1; NTSV <= 6; NTSV++){
    if ((BitrateA/(BitrateV*(10**3))) == ((7-NTSV)/NTSV)) {
        TSpacketLossA = RTPburstiness;
        TSBurstinessA = 7*(BitrateA/(BitrateA+(BitrateV*(10**3))))*RTPburstiness;
    }
}

var QcodA = (a1A * Math.exp(a2A*BitrateA)) + a3A;

var BurstinessA = (d1A*TSBurstinessA) + (d2A*BitrateA*TSBurstinessA) + d3A;
var FrameLossA = (c1A * BitrateA * TSpacketLossA) + (c2A*TSpacketLossA);
var QtraA = (b1A - QcodA)* (FrameLossA/(FrameLossA+(b2A*BurstinessA)+b3A));

var QA = 100 - QcodA - QtraA;
console.log(QA)
var mos_max = 4.9, mos_min = 1.05;
if (QA > 0 && QA < 100){
    var MOS = (mos_min + (mos_max-mos_min)/100*QA+QA*(QA-60)*(100-QA)*7.0*10**-6);
} else if (QA >= 100){
    var MOS = mos_max;
}else{
    var MOS = mos_min;
}
console.log(MOS)
console.log(QA)

