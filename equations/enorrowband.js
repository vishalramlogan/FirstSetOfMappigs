var Nc = -70, // electric Cricuti Noise
Nfor = -64, // Noise floor 
Ps =35, // room Noise Sender
Pr =35, // room Noise Receiver
SLR =8, //sender Loudness Rating
RLR =2, //receiver Loudness Rating
STMR =15, // sidetone Masking Rating 
Dr =3, // d Factor Receiver
LSTR = (STMR+Dr), // listiner Sidetone Rating SEE If TO REMOVE THIS
Ds = 3, // d Factor Sender
classofDelaySensitivity = 'Default', 
T = 0, // mean One Way Delay
Ta = T, // absolute Delay SEE If TO REMOVE THIS
Tr = 2*T, // round Trip Delay SEE If TO REMOVE THIS
TELR =65, // talker echo Loudness Rating
WEPL=110, //weighted echo Path Loss
qdu=1, 
Ie = 0, // equipment Impairment Factor
Bpl =4.3, //packet Loss Robustness Factor 
Ppl =0, // packet Loss Probability
BurstR =1,// Burst Ratio
A = 0; // advantage factor

var e = 2.718; 
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
/*
}else if (STMR >= 9 && STMR <= 20) {
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

*/
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
//console.log(Id);

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

console.log(MOS);