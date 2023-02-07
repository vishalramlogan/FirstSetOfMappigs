var packetLoss = 'Yes',
rebuffering = 'Yes',
Width = 320, // videoWidth
Height = 240, //videoHeight
videoPLC = 'freezing',
ARL = 2, //rebufferingLength in seconds
NRE = 3, //numRebufferingEvents
MREEF = 5, // rebufferingFactor
V_NBR = 2, // numVideos
videoContentCoding = 4,
codingCompression = 4,
MeasureTime = 2, //
TotalFrameNum = 24,
V_Burst = 0.3, //ipPacketLoss in seconds
V_LossRate = 2/100, //ipPacketLossRate
GopLength = 15, //gopLength
V_BR = 1200, // videoBitrate
videoFrameRate = 24;

var MOS_MAX = 5, MOS_MIN = 1;

if (codingCompression == 1){
    var v1 = 3.4, v2 = 0.969, v3 = 104.0, v4 = 1.0, v5 = 0.01, v6 = 1.1;
    if (videoPLC == 'slicing'){
        var v7 = -0.63, v8 = 1.4, v9 = 0.01, v10 = -14.4, v11 = 19.0, v12 = 1.04;
    } else if (videoPLC == 'freezing'){
        var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
    }
    var v14 = 0, v15 = 9.8, v16 = 0.85, v18 = 0;
} else if (codingCompression == 2){
    var v1 = 2.49, v2 = 0.7094, v3 = 324.0, v4 = 3.3, v5 = 0.5, v6 = 1.2;
    if (videoPLC == 'slicing'){
        var v7 = -0.64, v8 = 0.81, v9 = 0.4, v10 = -9.0, v11 = 11.5, v12 = 0.4;
    } else if (videoPLC == 'freezing'){
        var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 = 0.01;
    }
    var v14 = 0, v15 = 20.6, v16 = 0.37, v18 = 0;
}else if (codingCompression == 3){
    var v1 = 2.505, v2 = 0.7144, v3 = 170.0, v4 = 130.0, v5 = 0.05, v6 = 1.1;
    if (videoPLC == 'slicing'){
        var v7 = -0.05, v8 = 0.42, v9 = 0.72, v10 = -3.3, v11 = 7.0, v12 =0.49;
    } else if (videoPLC == 'freezing'){
        var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
    }
    var v14 = 0, v15 = 52.0, v16 = 0.42, v18 = 0;
}else if (codingCompression == 4){
    var v1 = 2.43, v2 = 0.692, v3 = 0.01, v4 = 134.0, v5 = 0.01, v6 = 1.7;
    if (videoPLC == 'slicing'){
        var v7 = -0.01, v8 = 0.99, v9 = 0.34, v10 = -0.1, v11 = 15.5, v12 =0.66;
    } else if (videoPLC == 'freezing'){
        var v7 = -0.115, v8 = 0.25, v9 = 2.05, v10 = -0.7, v11 = 1.5, v12 = 0.45;
    }
    var v13 = 2.5, v14 = 1.1, v15 = 2.5, v16 = 0.15, v17 = 4.65, v18 = 0.35;
}else if (codingCompression == 5){
    var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
    if (videoPLC == 'slicing'){
        var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
    } else if (videoPLC == 'freezing'){
        var v7 = -0.05, v8 = 0.53, v9 = 0.6, v10 = -0.1, v11 = 11.5, v12 =0.01;
    }
    var v13 = 2.1, v14 = 1.8, v15 = 2.7, v16 = 0.55, v17 = 7.6, v18 = 0.05;
}else if (codingCompression == 6){
    var v1 = 1.6184, v2 = 0.4611, v3 = 280.0, v4 = 11.0, v5 = 1.69, v6 = 0.02;
    if (videoPLC == 'slicing'){
        var v7 = -0.01, v8 = 0.76, v9 = 0.39, v10 = -0.01, v11 = 10.0, v12 = 0.86;
    } else if (videoPLC == 'freezing'){
        var v7 = -0.05, v8 = 0.32, v9 = 0.24, v10 = -0.1, v11 = 1.0, v12 = 1.16;
    }
    var v13 = 3.4, v14 = 0.79, v15 = 3.71, v16 = 0.39, v17 = 7.25, v18 = 0.1;
}
// V_PLEF
var TotalPktNumtmp = (V_BR*1000*MeasureTime)/(1000*8);
if (TotalPktNumtmp < TotalFrameNum){
    var TotalPktNum = TotalFrameNum + (TotalPktNumtmp/10);
}else {
    var TotalPktNum = TotalPktNumtmp;
}
var V_PktpF = TotalPktNum/(videoFrameRate*MeasureTime);
var V_ratio = V_Burst / V_PktpF;
if (V_ratio < 1){
    var V_PLEF = (TotalPktNum*V_LossRate)/V_Burst;
} else{
    var V_PLEF = ((TotalPktNum*V_LossRate)/V_PktpF);
}
var V_AIRF = ((1)/(1-((1-V_LossRate)**V_PktpF))) - ((1-V_LossRate)/(V_LossRate*V_PktpF));
console.log((1-((1-V_LossRate)**V_PktpF)))
// V_IR
var V_LossRateFrame = 1 - ((1-V_LossRate)**V_PktpF);
var V_IR = 1 - ((1-V_LossRateFrame)/(V_LossRateFrame*GopLength)) * (1-((1-V_LossRateFrame)**GopLength));

// V_CCF
if (videoContentCoding == 1){
    var a = 0.1077, b = 0.0207, c = 0.91, d = 0.02;
} else if (videoContentCoding == 2){
    var a = 0.0975, b = 0.0001, c = 0.85, d = 0.02;
} else if (videoContentCoding == 3){
    var a = 0.0908, b = 0.0001, c = 0.86, d = 0.02;
} else if (videoContentCoding == 4){
    var a = 0.1155, b = 0.0994, c = 0.90, d = 0.012;
} else if (videoContentCoding == 5){
    var a = 0.1129, b = 0.0931, c = 0.90, d = 0.012;
}
var Threshold = d * Width * Height;
if (V_BR < Threshold){
    var V_CCF = (a*Math.log(V_BR)) + b;
}else if (V_BR >= Threshold){
    var V_CCF = c;
}

// V_MOSC
var V_DC = (MOS_MAX-MOS_MIN)/(1+(V_NBR/((v3*V_CCF)+v4))**((v5*V_CCF)+v6));
if (videoFrameRate >= 24){
    var V_MOSC = MOS_MAX - V_DC;
} else {
    var V_MOSC = (MOS_MAX- V_DC)*(1 + (v1*V_CCF) - (v2*V_CCF * Math.log10(1000/videoFrameRate)));
}

// V_MOSP
if (videoPLC == 'slicing'){
    var V_DP = (V_MOSC - MOS_MIN)*(((((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12))/
    (1+(((V_AIRF*V_IR)/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12)));
} if (videoPLC == 'freezing'){
    var V_DP = (V_MOSC - MOS_MIN)*((((V_IR/(v7*V_CCF+v8))**v9) * ((V_PLEF/(v10*V_CCF+v11))**v12))/
    (1+((V_IR/((v7*V_CCF)+v8))**v9) * ((V_PLEF/((v10*V_CCF)+v11))**v12)));
}
var V_MOSP = V_MOSC - V_DP;

// V_MOSR
if (rebuffering == 'Yes' && packetLoss == 'Yes'){
    var Video_Quality = V_MOSP;
} else {
    var Video_Quality = V_MOSC;
}
var V_DR = (Video_Quality-MOS_MIN) * (((NRE/v13)**v14 * (ARL/v15)**v16 * (MREEF/v17)**v18)/
           (1 + (NRE/v13)**v14 * (ARL/v15)**v16 * (MREEF/v17)**v18));
var V_MOSR = Video_Quality - V_DR;

if (packetLoss == 'No' && rebuffering == 'No'){
    var V_MOS = V_MOSC;
} else if (packetLoss == 'Yes' && rebuffering == 'No' ){
    var V_MOS = V_MOSP;
} else {
    var V_MOS = V_MOSR;
}
console.log(V_MOS)