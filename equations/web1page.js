var Max= 30, // expectedSessionTime2PS
SessionTime = 1; //sessionTime2PS

var Min = 0.005*Max+0.24;

var MOS = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;
console.log(MOS)