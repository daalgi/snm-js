const {
    randomPointInBox,
    boundingBoxAddition, 
    boundingBoxArea,
    findLineXaxisIntersection
} = require('./geometry')
const { factorial } = require('./utils')

/**
 * Trapezoidal rule to integrate (f(x) dx)
 * @param {Array} f points of the function of the x-axis
 * @param {Array} x points of the x-axis
 * @returns {Float}
 */
function trapezoidalForceIntegration({ x, f }) {
    let n = f.length
    if (x.length !== n)
        throw new Error("The length of the vectors x and y must be equal")
    let sum = 0
    for (let i = 1; i < n; i++) {
        sum += (f[i - 1] + f[i]) * (x[i] - x[i - 1]) / 2
    }
    return sum
}

/**
 * Trapezoidal rule to integrate (f(x) x dx)
 * @param {Array} f points of the function of the x-axis
 * @param {Array} x points of the x-axis
 * @returns {Float}
 */
function trapezoidalMomentIntegration({ x, f, xref = 0 }) {
    let n = f.length
    if (x.length !== n)
        throw new Error("The length of the vectors x and y must be equal")
    if (xref !== 0)
        // Change the x-coordinate origin to the xref
        // (won't change the original x array outside the function)
        x = x.map(val => val - xref)
    let sum = 0, addend1, addend2
    for (let i = 1; i < n; i++) {
        addend1 = f[i - 1] * (x[i] + x[i - 1])
        addend2 = (f[i] - f[i - 1]) * (2 * x[i] + x[i - 1]) / 3
        sum += (addend1 + addend2) * (x[i] - x[i - 1]) / 2
    }
    return sum
}

/**
 * Given a function (result, r) along a path (p), divide it into the different 
 * stretches with the same sign and integrate the resultant in each one. 
 * For example, the distribution of stresses in the cross-section of a beam under 
 * bending can go from positive to negative, defining two stretches 
 * (the positive one and the negative one).
 * @param {Array} p is the path along which the function is integrated
 * @param {Array} r is the function (result) to be integrated
 * @returns {Array} - array of objects, each one containing the resultant, the initial and final points of the stretch and the centroid
 * @todo make the algorithm more elegant?
 */
function resultantStretches({ p, r }) {
    let n = p.length
    if (n < 2) throw new Error("The path should have at least two points")
    if (n !== r.length) throw new Error("The path and the results arrays must have the same length")

    const stretches = []
    let end = false
    let i = 1
    let path_i = p[0]
    let path_last_i = 0
    let path_f, last_r, resultant, centroid
    let subPath, subRes
    while (!end) {

        if (r[i] === 0) {

            // If the function is exactly equal to 0, add the stretch object
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

        } else if (i < n - 1 && r[i] * r[i - 1] < 0) {
            //console.log('inside sign change')
            // If there is a change in the sign of the result
            // add a stretch object from the final previous one 
            // to the x-coordinate where the function is equal to zero
            path_f = findLineXaxisIntersection({ x1: p[i - 1], y1: r[i - 1], x2: p[i], y2: r[i] })
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

        // If it is the last index
        if (i === n - 1) {
            //console.log('inside last index')
            // If there is a change of sign in the last two points of the path,
            // close the penultimate stretch
            if (r[i] * r[i - 1] < 0) {
                //console.log('inside last index with sign change')
                path_f = findLineXaxisIntersection({ x1: p[i - 1], y1: r[i - 1], x2: p[i], y2: r[i] })
                subPath = p.slice(path_last_i, i + 1).concat(path_f)
                subRes = r.slice(path_last_i, i + 1).concat(0)
                //console.log(subPath, subRes)
                resultant = trapezoidalForceIntegration({ x: subPath, f: subRes })
                centroid = resultant === 0 ? 0 : trapezoidalMomentIntegration({ x: subPath, f: subRes }) / resultant
                // Add the object to the array of stretches
                stretches.push({ path_i, path_f, resultant, centroid })

                // Update for next stretch
                path_i = path_f
                path_last_i = i
                last_r = 0

                // Close the last stretch
                //console.log('close last stretch')
                path_f = p[i]
                subPath = [path_i].concat(p.slice(path_last_i, n))
                subRes = [0].concat(r.slice(path_last_i, n))
                //console.log(subPath, subRes)
                resultant = trapezoidalForceIntegration({ x: subPath, f: subRes })
                centroid = resultant === 0 ? 0 : trapezoidalMomentIntegration({ x: subPath, f: subRes }) / resultant
                // Add the object to the array of stretches
                stretches.push({ path_i, path_f, resultant, centroid })

            } else {

                // Close the last stretch (without sign change in the last two path points)
                //console.log('close last stretch normally')
                path_f = p[i]
                subPath = p.slice(path_last_i, n)
                subRes = r.slice(path_last_i, n)
                //console.log(subPath, subRes)
                resultant = trapezoidalForceIntegration({ x: subPath, f: subRes })
                centroid = resultant === 0 ? 0 : trapezoidalMomentIntegration({ x: subPath, f: subRes }) / resultant
                // Add the object to the array of stretches
                stretches.push({ path_i, path_f, resultant, centroid })

            }


        }  // if(i === n-1)

        // Finish the loop or prepare next iter
        if (i === n - 1)
            end = true
        else
            i++
    }
    return stretches
}

/**
 * Gauss-Legendre definite numerical integration
 * Source:
 * https://rosettacode.org/wiki/Numerical_integration/Gauss-Legendre_Quadrature#JavaScript
 * @param {Function} fn - function to evaluate
 * @param {Float} a - integration initial point
 * @param {Float} b - integration final point
 * @param {Number} n - quadrature order (roots of the Legendre polynomial)
 * @returns {Float}
 */
const M = n => (n - (n % 2 !== 0)) / 2
function gaussLegendre(fn, a, b, n) {
    // coefficients of the Legendre polynomial
    const coef = [...Array(M(n) + 1)].map((v, m) =>
        v = (-1) ** m * factorial(2 * n - 2 * m) / (2 ** n * factorial(m) * factorial(n - m) * factorial(n - 2 * m)))
    // the polynomial function 
    const f = x =>
        coef.map((v, i) => v * x ** (n - 2 * i))
            .reduce((sum, item) => sum + item, 0)
    const terms = coef.length - (n % 2 === 0)
    // coefficients of the derivative polybomial
    const dcoef = [...Array(terms)]
        .map((v, i) => v = n - 2 * i)
        .map((val, i) => val * coef[i])
    // the derivative polynomial function
    const df = x =>
        dcoef.map((v, i) => v * x ** (n - 1 - 2 * i))
            .reduce((sum, item) => sum + item, 0)
    const guess = [...Array(n)].map((v, i) =>
        Math.cos(Math.PI * (i + 1 - 1 / 4) / (n + 1 / 2)))
    // Newton Raphson 
    const roots = guess.map(xo =>
        [...Array(100)].reduce(x => x - f(x) / df(x), xo))
    const weights = roots.map(v =>
        2 / ((1 - v ** 2) * df(v) ** 2))
    return (b - a) / 2 * weights.map((v, i) =>
        v * fn((b - a) * roots[i] / 2 + (a + b) / 2)).reduce((sum, item) =>
            sum + item, 0)
}

/**
 * Gauss-Legendre definite numerical integration by intervals
 * @param {Function} fn - function to evaluate
 * @param {Array} intervals - interval points, where the discontinuities are in a non-continuous function
 * @param {Float} b - integration final point
 * @param {Number} n - quadrature order (roots of the Legendre polynomial)
 * @returns {Float}
 */
const gaussLegendreByIntervals = (fn, intervals=[], n) => {
    if(intervals.length < 2) return null
    let sum = 0
    for(let i = 1; i < intervals.length; i++){
        sum += gaussLegendre(fn, intervals[i-1], intervals[i], n)
    }
    return sum
}

/**
 * Montecarlo numerical integration for an array of planar shapes
 * @param {Array} shapes 
 * @param {Number} numPoints
 * @param {Array} iterations
 * @returns {Float}
 */
function montecarlo({ shapes, numPoints = 1000, iterations = 50 }) {
    let pointsIn = 0,
        randomPoint = 0,
        s = 0,
        insideShape = false,
        area = [],
        bb = boundingBoxAddition(shapes.map(s => s.boundingBox)),
        bbArea = boundingBoxArea(bb)
    //console.log(bb, bbbArea)
    for (iter = 0; iter < iterations; iter++) {
        for (p = 0; p < numPoints; p++) {
            randomPoint = randomPointInBox({ boundingBox: bb })
            // Check if the random point is inside any of the shapes
            while (!insideShape && s < shapes.length) {
                if (shapes[s].isInside(randomPoint)) {
                    insideShape = true
                }
                s++
            }
            if (insideShape) {
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

module.exports = {
    trapezoidalForceIntegration, 
    trapezoidalMomentIntegration,
    resultantStretches,
    gaussLegendre,
    gaussLegendreByIntervals,
    montecarlo
}