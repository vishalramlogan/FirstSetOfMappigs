var NumPixelsPerFrame =420, //numPixelsPerVideo
videoResolution = 'HD',
sliceFrame = 0.3,
//videoTSPackets = 1,
//audioBitrate = 1,
BitrateV =10, //videoBitrate
//rtpPacketLoss = 1,
//packetLossBurstiness = 1,
FrameRate = 30,
videoPLC = 'slicing',
FreezingRatio = 2,
LossMagnitude = 1;
 
if (videoResolution == 'SD'){
    var a1V = 61.28, a2V = -11.00, a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
    a31 = 0.91, a32 = -9.39, a33 = 0.10,
    p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;

} else if (videoResolution == 'HD'){
    var a1V = 51.28, a2V = -22.00 , a3V = 6.00, a4V = 6.21, b1V = 12.70, b2V =907.36, c1V = 17.73, c2V = 123.08,
    a31 = 3.92, a32 = -27.54, a33 = 0.26,
    p1 = 0.0001661, p2 = 0.1166, b21 = 69.39, b22 = 0.00019, b23 = 0.00082;
}

if (sliceFrame == 1){
    var q1 = 0.018, q2 = 0.040, c21 = 80.61, c22 = 0.00046, c23 = 0.00147;
} else {
    var q1 = 0.018, q2 = 0.040, c21 = 67.15, c22 = 0.00144, c23 = 0;
}

var BitPerPixel = (BitrateV*(10**6))/(NumPixelsPerFrame*FrameRate);
var ContentComplexity = a31*Math.exp(a32*BitPerPixel) + a33;
var QcodV =(a1V*Math.exp(a2V*BitPerPixel)) + (a3V*ContentComplexity) + a4V ;

if (videoPLC === 'freezing'){
    var FreezingRatioE = FreezingRatio*BitPerPixel;
    var QtraV = b1V*Math.log10((b2V*FreezingRatioE)+1);
} else if (videoPLC === 'slicing'){
    if(QcodV < 20){
        var QcodVn = 1;
    } else{
        var QcodVn = (0.1125*QcodV) - 1.25;
    }
    var LossMagnitudeE = LossMagnitude/QcodVn;
    var QtraV = c1V*Math.log10((c2V*LossMagnitudeE)+1);
}
var QV = 100 -QcodV - QtraV;

var mos_max = 4.9, mos_min = 1.05;
if (QV > 0 && QV < 100){
    var MOS = (mos_min + (mos_max-mos_min)/100*QV+QV*(QV-60)*(100-QV)*7.0*10**-6);
} else if (QV >= 100){
    var MOS = mos_max;
}else{
    var MOS = mos_min;
}
console.log(MOS)