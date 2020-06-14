const { Vector, Matrix } = require("./src/linear-algebra")
const { polynomial, leastSquaresRegression } = require("./src/regression")
const { sum } = require("./src/utils")
const { randomPointInBox,
    boundingBoxAddition,
    Rectangle, Circle,
    RectangularPrism, Sphere } = require('./src/geometry')
const { montecarlo, resultantStretches, gaussLegendre } = require('./src/integration')
const { brent } = require('./src/rootFinding')
const { linearInterpolation } = require('./src/utils')
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
let circle = new Circle({ center: [0, 0], radius: 3 })
let rectangle = new Rectangle({ center: [50, 50], width: 80, height: 100 })
let cube = new RectangularPrism({ center: [0, 0, 0], width: 2, height: 2, depth: 2 })
let sphere = new Sphere({ center: [0, 0, 0], radius: 3 })
let bb = [rectangle.boundingBox, circle.boundingBox]
let rect1 = new Rectangle({ center: [4, 1], width: 8, height: 2 })
let rect2 = new Rectangle({ center: [7.5, 3], width: 5, height: 4 })
//console.log(montecarlo({shapes: [rect1, rect2], numPoints: 1000, iterations:100}))
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
/*
let x = [-1, 1]
let y = [-1, 1]
let res = resultantStretches({ p: x, r: y })
console.log(res)*/
let arrX = [0, 1, 2, 3]
let arrY = [0, 1, 2, 3]
let x = 4
//console.log(linearInterpolation(arrX, arrY, x))
let f = x => (2 * x - x * x)
//console.log(gaussLegendre(f, -1, 10, 50))

/*x = [0, 1, 2, 3]
y = [0, 1, -4, 9]
let data = [{ x: 1, y: 3 }, { x: 2, y: 6 }, { x: 3, y: 11 }]
//console.log(polynomial({ x, y, order: 2 }))
let model = leastSquaresRegression({ type: "quadratic", data })
console.log(model)*/

/*f = x => x + 12
console.log(brent(f, -10, 10, 1e-7))*/

/*f = x => Math.sin(Math.sqrt(x)) * Math.exp(Math.sqrt(x)) / Math.sqrt(x)
let sqrt = Math.sqrt(Math.PI)
let exp = Math.exp(sqrt)
let result = exp * Math.sin(sqrt) - exp * Math.cos(sqrt) + 1*/
f = x => Math.exp(Math.sqrt(x)) * Math.sqrt(x)
let result = (8 - Math.pow(2, 5/2)) * Math.exp(Math.sqrt(2)) - 2 * Math.exp(1)
console.log(result)
console.log(gaussLegendre(f, 1, 2, 2)-result)
console.log(gaussLegendre(f, 1, 2, 3)-result)
console.log(gaussLegendre(f, 1, 2, 4)-result)
console.log(gaussLegendre(f, 1, 2, 5)-result)
console.log(gaussLegendre(f, 1, 2, 10)-result)
console.log(gaussLegendre(f, 1, 2, 20)-result)
console.log(gaussLegendre(f, 1, 2, 30)-result)

//f = x => Math.exp(-x) * Math.pow(Math.sin(4 * x), 2)
/*f = x => Math.exp(-x) * Math.pow(Math.sin(4 * x), 2)
console.log(gaussLegendre(f, -1, 1, 4))
console.log(gaussLegendre(f, -1, 1, 10))
console.log(gaussLegendre(f, -1, 1, 15))
console.log(gaussLegendre(f, -1, 1, 20))
console.log(gaussLegendre(f, -1, 1, 25))
console.log(gaussLegendre(f, -1, 1, 30))*/