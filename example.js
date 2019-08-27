const { Vector } = require("./src/vector");
const { Matrix } = require("./src/matrix");
const { polynomial } = require("./src/regression");
const { sum } = require("./src/utils");


let I = Matrix.eye(2);
I.rows[0][1] = 2;
let ItI = I.transpose().multiply(I);
//console.log(ItI);

let x = new Array(10000).fill().map((_, i) => -500+i);
let y = x.map(x => 10 * x*x - 100 * x + 13 + Math.random()*x * 10);
let pol = polynomial({x: x, y: y, order: 2});
console.log(pol.coefs);
console.log(pol.metrics);