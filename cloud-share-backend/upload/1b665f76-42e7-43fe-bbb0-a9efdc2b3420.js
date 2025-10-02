const accountId = 144553;
let accountEmail = "pratikvsalunkhe924@gmail.com";
var accountPass = "12345";
accountCity = "Jaipur"; //never recommended

let accountState;

//accountId = 2;
//console.log(accountId); //Will throw error cannot resssign

accountEmail = "pvs@gmail.com";
accountPass = "23232";
accountCity = "Bengluru";

console.log(accountId);

console.table([accountId, accountEmail, accountPass, accountCity, accountState]);

/*
var :- prefer not to use because of issue of block scope and functional scope
*/

//number => 2 to power 53
// bigint
// string = ""
// boolean => true/false
// null => standalone value
// undefined
// symbol => unique

//object
console.log(typeof null);
console.log(typeof "Pratik Salunkhe");
console.log(typeof undefined);