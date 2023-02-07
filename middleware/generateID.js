module.exports = function getID() {
    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth()+1).toString().padStart(2, '0');
let year = date.getFullYear();
let hours = date.getHours().toString().padStart(2, '0');
let minutes = date.getMinutes().toString().padStart(2, '0');
let seconds = date.getSeconds().toString().padStart(2, '0');

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWQYZabcdefghijklmnopqrstuvwxyz"

const randomCharacter1 = alphabet[Math.floor(Math.random() * alphabet.length)];
const randomCharacter2 = alphabet[Math.floor(Math.random() * alphabet.length)];
const randomCharacter3 = alphabet[Math.floor(Math.random() * alphabet.length)];
const randomCharacter4 = alphabet[Math.floor(Math.random() * alphabet.length)];

//let uniqueID = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
return  `${day}${month}${year}${hours}${minutes}${seconds}` 
+ randomCharacter1+randomCharacter2+randomCharacter3+randomCharacter4;
}