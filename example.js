const { Vector, Matrix } = require("./src/linear-algebra")
const { polynomial } = require("./src/regression")
const { sum } = require("./src/utils")
const { randomPointInBox, 
        boundingBoxAddition,
        Rectangle, Circle,
        RectangularPrism, Sphere } = require('./src/geometry')
const { montecarlo } = require('./src/integration')
/*
let I = Matrix.eye(2);
I.rows[0][1] = 2;
let ItI = I.transpose().multiply(I);
//console.log(ItI);

let x = new Array(10000).fill().map((_, i) => -500+i);
let y = x.map(x => 10 * x*x - 100 * x + 13 + Math.random()*x * 10);
let pol = polynomial({x: x, y: y, order: 2});
console.log(pol.coefs);
console.log(pol.metrics);*/
let p = 0
let circle = new Circle({ center: [0, 0], radius: 3})
let rectangle = new Rectangle({ center:[50, 50], width:80, height:100})
let cube = new RectangularPrism({ center: [0, 0, 0], width:2, height:2, depth:2 })
let sphere = new Sphere({ center: [0, 0, 0], radius: 3 })
let bb = [rectangle.boundingBox, circle.boundingBox]
let rect1 = new Rectangle({ center: [4, 1], width: 8, height: 2})
let rect2 = new Rectangle({ center: [7.5, 3], width: 5, height: 4})
console.log(montecarlo({shapes: [rect1, rect2], numPoints: 1000, iterations:100}))
//console.log(bb)
//console.log(Math.min(...bb.map((_, i) => bb[i][0][0])))
//console.log(boundingBoxAddition(bb))
/*
for(let i = 0; i < 10; i++){
    //p = randomPointInBox({boundingBox: [[0, 0], [2, 2]]})
    p = randomPointInBox({boundingBox: [[-3, -3, -3], [3, 3, 3]]})
    //console.log(p, circle.isInside(p))
    //console.log(p, rectangle.isInside(p))
    //console.log(p, cube.isInside(p))
    console.log(p, sphere.isInside(p))
}*/