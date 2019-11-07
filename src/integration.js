const { 
    randomPointInBox,
    boundingBoxAddition, boundingBoxArea } = require('./geometry')
const { findLineXaxisIntersection } = require('./utils')

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
      }
      return sum
}

/**
 * Given a function (result, r) along a path (p), divide it into the different stretches with the same sign and integrate the resultant in each one. For example, the distribution of stresses in the cross-section of a beam under bending can go from positive to negative, defining two stretches (the positive one and the negative one)
 * @param {Array} p is the path along which the function is integrated
 * @param {Array} r is the function (result) to be integrated
 * @returns {Array} array of objects, each one containing the resultant, the initial and final points of the stretch and the centroid
 * @todo last stretch incorrect if the length is 1 (1 path point)
 */
function resultantStretches({ p, r }) {
    let n = p.length
    if(n < 2) throw new Error("The path should have at least two points")
    if(n !== r.length) throw new Error("The path and the results arrays must have the same length")

    const stretches = []
    let end = false
    let i = 1  
    let path_i = p[0]
    let path_last_i = 0
    let path_f, resultant, centroid
    let subPath, subRes
    while(!end) {
      
      if(r[i] === 0) {
        
        path_f = p[i]
        //console.log(path_i, path_f)
        subPath = p.slice(path_last_i, i + 1)
        subRes = r.slice(path_last_i, i + 1)
        resultant = trapezoidalForceIntegration({ x: subPath, f: subRes })
        centroid = resultant === 0 ? 0 : trapezoidalMomentIntegration({ x: subPath, f: subRes }) / resultant
        // Add the object to the array of stretches
        stretches.push({ path_i, path_f, resultant, centroid })
        
        // Update for next stretch
        path_i = path_f
        path_last_i = i
        
      } else if(r[i] * r[i-1] < 0) {
        
        // If there is a change in the sign of the result
        // add a stretch object
        path_f = findLineXaxisIntersection({ x1: p[i-1], y1: r[i-1], x2: p[i], y2: r[i] })
        subPath = p.slice(path_last_i, i + 1).concat(path_f)
        subRes = r.slice(path_last_i, i + 1).concat(0)
        resultant = trapezoidalForceIntegration({ x: subPath, f: subRes })
        centroid = resultant === 0 ? 0 : trapezoidalMomentIntegration({ x: subPath, f: subRes }) / resultant
        // Add the object to the array of stretches
        stretches.push({ path_i, path_f, resultant, centroid })      
        
        // Update for next stretch
        path_i = path_f
        path_last_i = i
        
      }
      
      if(i === n-1) {
        // If it is the last index, fill the last stretch
        path_f = p[n-1]
        subPath = p.slice(path_last_i, n)
        subRes = r.slice(path_last_i, n)
        resultant = trapezoidalForceIntegration({ x: subPath, f: subRes })
        centroid = resultant === 0 ? 0 : trapezoidalMomentIntegration({ x: subPath, f: subRes }) / resultant
        // Add the object to the array of stretches
        stretches.push({ path_i, path_f, resultant, centroid })      
    
      } 
      // Finish the loop
      if(i === n-1) end = true
      else          i++
    }
    return stretches
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
    resultantStretches,
    montecarlo
}