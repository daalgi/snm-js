const { 
    randomPointInBox,
    boundingBoxAddition, boundingBoxArea } = require('./geometry')

/**
 * Montecarlo numerical integration for an array of shapes planar
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

module.exports = { montecarlo }