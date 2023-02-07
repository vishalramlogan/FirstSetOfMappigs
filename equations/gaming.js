var bitrate = 10,
numPixelsPerVideoFrame = 1920,
PL = 1, // packet Loss
FRenc = 24, // encodingFrameRate
lossSensitivityClass = 'Low',
encodingComplecity = 'Low',
delay = 10;


if (encodingComplecity == 'Low'){
    var a1v = 52.5052,
    a2v = -28.017,
    a3v = -2.68405,
    a4v = 5.46648,
    a31 = 12.4214,
    a32 = -28.0192,
    a33 = 0.215799,
    c1v = 19.7092,
    c2v = 3358.31,
    c21 = 28.3699,
    c23 = 0.0234973,
    q1 = 0.0016474,
    q2 =0.0895914;
} else if (encodingComplecity == 'Medium'){
    var a1v = 37.9882,
    a2v = -13.7208,
    a3v = 8.57837,
    a4v = 3.26581,
    a31 = 6.83276,
    a32 = -127.997,
    a33 = 0.479595,
    c1v = 0.612879,
    c2v = 0.00139396,
    c21 = 56.2893,
    c23 = 0.0047567,
    q1 = 0.0581327,
    q2 = 2.38014;
}else{
    var a1v = 47.7463,
    a2v = -12.07,
    a3v = 9.05168,
    a4v = 3.41919,
    a31 = 7.62306,
    a32 = -167.838,
    a33 = 0.0760333,
    c1v = 1.57176,
    c2v = 3.68596,
    c21 = 74.057,
    c23 = 0.00406,
    q1 = 2.58892*(10**(-8)),
    q2 = 0.868407;
}

// Calculating I_vq_cod
var BitPerPixel = (bitrate*(10**6))/(numPixelsPerVideoFrame*FRenc);
var ContentComplexity = (a31*Math.exp(a32*BitPerPixel)) + a33;
var I_vq_cod = (a1v * Math.exp(a2v*BitPerPixel)) + (a3v*ContentComplexity) + a4v;

// Calculating I_vq_trans
if (I_vq_cod <= 65){
    var Icodn = I_vq_cod;
}else{
    var Icodn = 65;
}
var LossMagnitudeNP = ((c21 - Icodn)*PL)/((c23*Icodn)+PL);
var LossMagnitudeE = (q1*Math.exp(q2*LossMagnitudeNP)) - q1;
var I_vq_trans = c1v * Math.log10((c2v*LossMagnitudeE) + 1);

// Calculating I_tvq
var d5 = 0.08526, d6 = 0.00073, d7 = 1.425*(10**(-4)), d8 = 0.09656, d9 = 1.5;
if (lossSensitivityClass === 'Low'){
    var d1= 29.13, d2 = 0.01344, d3 = -1.283, d4 = 6.724;
}else{
    var d1= 47.03, d2 = 0.01747, d3 = -1.823, d4 = 10.7;
}

if (delay < 16){
    var Avgfps = FRenc;
} else{
    var Avgfps =FRenc*Math.exp(-(d5 + (d6*FRenc) + (d7*bitrate*FRenc)) * ((d8*delay)-d9)*PL) ;
}

var FrameLossRate = ((FRenc-Avgfps)/(FRenc))*100;
var I_tvq = d1 + (d2*(FRenc**2)) + (d3*FRenc) +( d4*Math.log10(FrameLossRate+1));

// Calculating I_ipq_frames
if (lossSensitivityClass === 'Low'){
    var e1= 23.43, e2= 0.008574, e3=-0.9253, e4=5.855;
}else{
    var e1= 54.71, e2= 0.02589, e3=-2.485, e4=9.306;
}
var I_ipq_frames = e1 + (e2*(FRenc**2))+ (e3*FRenc) + (e4*Math.log10(FrameLossRate+1));

// Calculating I_ipq_delay
if (lossSensitivityClass === 'Low'){
    var f1=47.97, f2=2.097 , f3=0.01073, f4=-4.567;
}else{
    var f1= 90, f2=1.191, f3=0.009775, f4=-18.73;
}
var I_ipq_delay = (f1/(1+Math.exp(f2-(f3*delay)))) + f4;

var R_max = 100;
var a = 0.788, b = 0.896, c = 0.227, d = 0.625, e = 0.848;
var Rqoe = R_max - (a*I_vq_cod) - (b*I_vq_trans) - (c*I_tvq) -(d*I_ipq_frames) - (e*I_ipq_delay);
console.log(Rqoe);

var MOS_MAX = 4.64, MOS_MIN = 1.3, MOS;
if (Rqoe > 0 && Rqoe < 100){
    MOS = (1 + (MOS_MAX - MOS_MIN)/ 100*Rqoe + Rqoe*(Rqoe-60)*(100-Rqoe)*(7*10**(-6)))
}else if (Rqoe >= 100){
    MOS = MOS_MAX;
}else{
    MOS = MOS_MIN;
}

console.log(MOS);