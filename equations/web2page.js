var Max= 30, // expectedSessionTime2PS
SessionTime = 3; //sessionTime2PS

var Min = 0.011*Max + 0.47;

var MOS = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;
console.log(MOS)