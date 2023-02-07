var A_BR = 96,//audioBitrateLR
AudioFrameLength = 10,//audioFrameLength
IPPacketAverageBurstLength = 1, // averageBurstIP
MaximumofDataSizeperPacket = 65535, 
IPpacketLossRate = 0, // lossRateIPPackets
NumberofAudioFramesperPacket = 1024, // numAudioFrames
audioCodec = 'AMR-WB+' ;

if (audioCodec === 'AAC-LC'){
    var a1 = 3.36209, a2 = 16.46062, a3 = 2.08184, a4 = 0.352, a5 = 508.83419, a6 = 37.78354;
}else if (audioCodec === 'AAC-HEv1'){
    var a1 = 3.19135, a2 = 4.17393, a3 = 1.28241, a4 = 0.68955, a5 = 6795.99773, a6 = 186.76692;
}else if (audioCodec === 'AAC-HEv2'){
    var a1 = 3.13637, a2 = 7.45884, a3 = 2.15819, a4 = 0.61993, a5 = 3918.639, a6 = 153.3399;
}else if (audioCodec === 'AMR-NB'){
    var a1 = 1.33483, a2 = 6.42499, a3 = 3.49066, a4 = 0, a5 = 723.3661, a6 = 1;
}else if (audioCodec === 'AMR-WB+'){
    var a1 = 3.19158, a2 = 5.7193, a3 = 1.63208, a4 = 0, a5 = 826.7936, a6 = 1;
}

var A_MT = 1;
var A_ABPLL = IPPacketAverageBurstLength;
var A_LFLpP = AudioFrameLength * NumberofAudioFramesperPacket;
var A_NPpTS = (A_BR*AudioFrameLength)/(8*MaximumofDataSizeperPacket);
var A_PLEF =  (1000*A_NPpTS*IPpacketLossRate)/(A_LFLpP*A_ABPLL);
if (AudioFrameLength < (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS))){
    var A_LFL = A_PLEF * (A_LFLpP*((A_ABPLL + A_NPpTS -1)/A_NPpTS));
} else{
    var A_LFL = A_PLEF * AudioFrameLength;
}


var MA = (1-a4)*Math.exp(-(10*A_LFL)/(a5*A_MT)) + a4*Math.exp(-(10*A_LFL)/(a6*A_MT));
var A_MOSC = 1 + (a1 - (a1/(1+(A_BR/a2)**a3)));

var A_MOS = 1 + ((A_MOSC -1)*MA);
console.log(A_MOS);
