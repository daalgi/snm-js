const { 
    randomPointInBox,
    boundingBoxAddition, boundingBoxArea } = require('./geometry')

/**
 * Trapezoidal rule to integrate (f(x) dx)
 * @param {Array} f points of the function of the x-axis
 * @param {Array} x points of the x-axis
 */
function trapezoidalForceIntegration({x, f}){
    let n = f.length
    if(x.length !== n) 
        throw new Error("The length of the vectors x and y must be equal")
    let sum = 0
    for(let i = 1; i < n; i++){
        sum += (f[i-1] + f[i]) * (x[i] - x[i-1]) / 2
    }
    return sum
}

/**
 * Trapezoidal rule to integrate (f(x) x dx)
 * @param {Array} f points of the function of the x-axis
 * @param {Array} x points of the x-axis
 */
function trapezoidalMomentIntegration({x, f, xref = 0}) {
    let n = f.length
    if(x.length !== n) 
        throw new Error("The length of the vectors x and y must be equal")
    if(xref !== 0)
        // Change the x-coordinate origin to the xref
        // (won't change the original x array outside the function)
        x = x.map(val => val - xref) 
    let sum = 0, addend1, addend2
    for(let i = 1; i < n; i++) {
        addend1 = f[i-1] * (x[i] + x[i-1])
        addend2 = (f[i] - f[i-1]) * (2 * x[i] + x[i-1]) / 3
        sum += (addend1 + addend2) * (x[i] - x[i-1]) / 2
        //sum += (y[i-1] * (x[i] + x[i-1]) + (y[i] - y[i-1]) * (2 * x[i] + x[i-1]) / 3) * (x[i] - x[i-1]) / 2
      }
      return sum
}

/**
 * Montecarlo numerical integration for an array of planar shapes
 * @param {array} shapes 
 * @param {number} numPoints
 * @param {array} iterations
 */
function montecarlo({shapes, numPoints = 1000, iterations = 50}){
    let pointsIn = 0,
        randomPoint = 0,
        s = 0,
        insideShape = false,
        area = [],
        bb = boundingBoxAddition(shapes.map(s => s.boundingBox)),
        bbArea = boundingBoxArea(bb)
    //console.log(bb, bbbArea)
    for(iter = 0; iter < iterations; iter++){
        for(p = 0; p < numPoints; p++){
            randomPoint = randomPointInBox({boundingBox: bb})
            // Check if the random point is inside any of the shapes
            while(!insideShape && s < shapes.length){
                if(shapes[s].isInside(randomPoint)){
                    insideShape = true
                } 
                s++
            }
            if(insideShape){
                pointsIn++
            } 
            //console.log(randomPoint, insideShape, pointsIn)
            // Update for next point
            insideShape = false
            s = 0
        }
        // Evaluate the area/volume of the addition of shapes
        area.push(pointsIn / numPoints * bbArea)
        // Update for next iteration
        pointsIn = 0
    }
    //console.log(area)
    return area.reduce((acc, v) => acc + v, 0) / iterations
}


//export {
module.exports = { 
    trapezoidalForceIntegration, trapezoidalMomentIntegration,
    montecarlo
}