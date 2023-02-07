/*
var Max= 50, // expectedSessionTime2PS
SessionTime = 3; //sessionTime2PS

var Min = 0.003*Max+0.12;

var MOS = (4/(Math.log(Min/Max)))*(Math.log(SessionTime)-Math.log(Min)) + 5;
console.log(MOS)
*/
var MOS = [];
for (let i = 0; i <= (4); i++) {
    
        var Max= [1,2,3,4,5], // expectedSessionTime2PS
        SessionTime = 1; //sessionTime2PS
    
        var Min = 0.003*Max[i]+0.12;
        MOS[i] = (4/(Math.log(Min/Max[i])))*(Math.log(SessionTime)-Math.log(Min)) + 5;
        console.log(MOS[i])
}   
console.log(MOS)