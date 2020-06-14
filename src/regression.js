const { Matrix, Vector } = require("./linear-algebra")
const { sum } = require("./utils")

/**
 * ORDINARY LEAST SQUARES LINEAR REGRESSION MODULE
 */

/**
 * Metrics to evaluate a regression model
 * @param {Array} x
 * @param {Array} y
 * @param {Array} func
 * @param {Array} coefs
 * @returns {Object} - { meanAbsoluteError, meanSquaredError, rootMeanSquaredError, meanAbsolutePercentageError, r2score, r2scoreAdjusted }
 */
const computeMetrics = ({ x, y, func, coefs }) => {
    return {
        meanAbsoluteError: meanAbsoluteError({ x, y, func }),
        meanSquaredError: meanSquaredError({ x, y, func }),
        rootMeanSquaredError: rootMeanSquaredError({ x, y, func }),
        meanAbsolutePercentageError: meanAbsolutePercentageError({ x, y, func }),
        r2score: r2score({ x, y, func }),
        r2scoreAdjusted: r2scoreAdjusted({ x, y, func, coefs }),
    }
}
const meanAbsoluteError = ({ x, y, func }) => {
    return sum(y.map((y, i) => Math.abs(y - func(x[i])))) / x.length
}
const meanSquaredError = ({ x, y, func }) => {
    return sum(y.map((y, i) => Math.pow(y - func(x[i]), 2))) / x.length
}
const rootMeanSquaredError = ({ x, y, func }) => {
    return Math.sqrt(meanSquaredError({ x, y, func }))
}
const meanAbsolutePercentageError = ({ x, y, func }) => {
    return 100 / x.length * sum(y.map((y, i) => Math.abs((y - func(x[i]) / y))))
}
const totalSumSquares = ({ x, y, func }) => {
    let yMean = sum(y) / y.length
    return sum(y.map(y => Math.pow(y - yMean, 2)))
}
const residualSumSquares = ({ x, y, func }) => {
    return sum(y.map((y, i) => Math.pow(y - func(x[i]), 2)))
}
const r2score = ({ x, y, func }) => {
    return 1 - residualSumSquares({ x, y, func }) / totalSumSquares({ x, y, func })
}
const r2scoreAdjusted = ({ x, y, func, coefs }) => {
    let r2 = r2score({ x, y, func })
    let n = x.length
    let num_coefs = coefs.length
    return 1 - (1 - r2) * ((n - 1) / (n - (num_coefs + 1)))
}

/**
 * Polynomial regression: y = a0 + a1 * x + a2 * x^2 + ... + an * x^n
 * @param {Array} x
 * @param {Array} y
 * @param {Integer} order
 * @returns {Object} - { coefs, predict, metrics, equation }
 */
const polynomial = ({ x, y, order = 2 }) => {
    if (!Array.isArray(x) || !Array.isArray(y))
        throw new Error("x and y should be arrays")
    if (x.length !== y.length)
        throw new Error("the length of the arrays x and y should be the same")

    // Solution of the linear system of equations
    const matA = new Matrix(...new Array(x.length)
        .fill()
        .map((_, i) =>
            new Array(order + 1).fill().map((_, j) => x[i] ** (order - j)))
    )
    const mat_AtA_inv = matA.transpose().multiply(matA).inverse()
    let yVector = new Vector(...y)
    const vec_Aty = yVector.transform(matA.transpose())
    const coefs = vec_Aty.transform(mat_AtA_inv).toArray()

    // Predict function
    const predict = (x) => {
        return sum(coefs.map((coef, i) => coef * Math.pow(x, coefs.length - i - 1)))
    }

    let metrics = computeMetrics({ x, y, func: predict, coefs })

    // Equation (string)
    let equation = { withParameters: 'y = ', withCoefficients: 'y = ' }
    for (let i = 0; i < order + 1; i++) {
        if (i === 0) {
            equation.withParameters += 'a0'
            equation.withCoefficients += `${coefs[order - i]}`
        } else {
            equation.withParameters += [
                ` + a${i} * `,
                (i < 2) ? 'x' : `x^${i}`
            ].join('')
            equation.withCoefficients += [
                (coefs[order - i] < 0 ? ' -' : ' +') + ` ${Math.abs(coefs[order - i])} * `,
                (i < 2) ? 'x' : `x^${i}`
            ].join('')
        }
    }

    //return {coefs, predict, r2}
    return { coefs, predict, metrics, equation }
}

/**
 * Logarithmic regression: y = a + b log(x) 
 * (Math.log(x) = ln(x) in mathematics)    
 * source: http://mathworld.wolfram.com/LeastSquaresFittingLogarithmic.html
 * @param {Array} x
 * @param {Array} y
 * @returns {Object} - { coefs, predict, metrics, equation }
 */
const logarithmic = ({ x, y }) => {
    let sum_logxi = sum(x.map(x => Math.log(x)))
    let sum_logxi2 = sum(x.map(x => Math.pow(Math.log(x), 2)))
    let sum_yilogxi = sum(x.map((x, i) => y[i] * Math.log(x)))
    let sum_yi = sum(y)
    let n = x.length
    let denom = n * sum_logxi2 - Math.pow(sum_logxi, 2)
    let b = (n * sum_yilogxi - sum_yi * sum_logxi) / denom
    let a = (sum_yi - b * sum_logxi) / n

    let coefs = [a, b]

    // Predict function
    const predict = (x) => {
        return coefs[0] + coefs[1] * Math.log(x)
    }

    let metrics = computeMetrics({ x, y, func: predict, coefs })

    // Equation (string)
    let equation = {
        withParameters: 'y = a0 + a1 * log(x)',
        withCoefficients: `y = ${coefs[0]} ${coefs[1] < 0 ? '-' : '+'} ${Math.abs(coefs[1])} * log(x)`
    }

    return { coefs, predict, metrics, equation }
}

/**
 * Exponential regression: y = a * exp(b * x)
 * source: http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
 * @param {Array} x
 * @param {Array} y
 * @returns {Object} - { coefs, predict, metrics, equation }
 */
const exponential = ({ x, y }) => {
    let sum_xi = sum(x)
    let sum_xi2 = sum(x.map(v => v * v))
    let sum_logyi = sum(y.map(v => Math.log(v)))
    let sum_xilogyi = sum(x.map((v, i) => v * Math.log(y[i])))
    let denom = x.length * sum_xi2 - Math.pow(sum_xi, 2)
    let a = (sum_logyi * sum_xi2 - sum_xi * sum_xilogyi) / denom
    let b = (x.length * sum_xilogyi - sum_xi * sum_logyi) / denom

    let coefs = [Math.exp(a), b]

    // Predict function
    const predict = (x) => {
        return coefs[0] * Math.exp(coefs[1] * x)
    }

    let metrics = computeMetrics({ x, y, func: predict, coefs })

    // Equation (string)
    let equation = {
        withParameters: 'y = a0 * exp(a1 * x)',
        withCoefficients: `y = ${coefs[0]} * exp(${coefs[1]} * x)`
    }

    return { coefs, predict, metrics, equation }
}

/**
 * Power Law regression: y = a x^b
 * source: http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html
 * TODO: check log(0) values
 * @param {Array} x
 * @param {Array} y
 * @returns {Object} - { coefs, predict, metrics, equation }
 */
const power = ({ x, y }) => {
    let sum_logxi = sum(x.map(v => Math.log(v)))
    let sum_logxi2 = sum(x.map(v => Math.pow(Math.log(v), 2)))
    let sum_logyi = sum(y.map(v => Math.log(v)))
    let sum_logxilogyi = sum(x.map((v, i) => Math.log(v) * Math.log(y[i])))
    let n = x.length
    let denom = n * sum_logxi2 - Math.pow(sum_logxi, 2)
    let b = (n * sum_logxilogyi - sum_logxi * sum_logyi) / denom
    let a = (sum_logyi - b * sum_logxi) / n

    let coefs = [Math.exp(a), b]

    // Predict function
    const predict = (x) => {
        return coefs[0] * Math.pow(x, coefs[1])
    }

    let metrics = computeMetrics({ x, y, func: predict, coefs })

    // Equation (string)
    let equation = {
        withParameters: 'y = a * x^(b)',
        withCoefficients: `y = ${coefs[0]} * x^(${coefs[1]})`
    }

    return { coefs, predict, metrics, equation }
}


const LeastSquaresRegressionFactory = {
    linear: ({ x, y }) => polynomial({ x, y, order: 1 }),
    quadratic: ({ x, y }) => polynomial({ x, y, order: 2 }),
    cubic: ({ x, y }) => polynomial({ x, y, order: 3 }),
    quartic: ({ x, y }) => polynomial({ x, y, order: 4 }),
    polynomial: ({ x, y, order }) => polynomial({ x, y, order }),
    logarithmic: ({ x, y }) => logarithmic({ x, y }),
    exponential: ({ x, y }) => exponential({ x, y }),
    power: ({ x, y }) => power({ x, y })
}

const REGRESSION_TYPES = Object.keys(LeastSquaresRegressionFactory)

/**
 * Wrapper of the differente least squares regression functions,
 * where the input must be passed as an array of objects { x, y }
 * instead of two arrays of numbers x, y.
 * @param {String} type - regression type: linear, quadratic, cubic, quartic, polynomial, logarithmic, exponential, power
 * @param {Object} data - { x, y }
 * @returns {Object} - { coefs, predict, metrics, equation }
 */
const leastSquaresRegression = ({ type, data, ...props }) => {

    if (!REGRESSION_TYPES.includes(type.toLowerCase()))
        type = "linear"

    // Convert the array of objects into two arrays of numbers
    let x = [], y = []
    for (let i = 0; i < data.length; i++) {
        if (!isNaN(data[i].x) && !isNaN(data[i].y) && ![null, undefined].includes(data[i].x, data[i].y)) {
            x.push(parseFloat(data[i].x))
            y.push(parseFloat(data[i].y))
        }
    }

    // Check the length of the arrays
    if (x.length < 2 || x.length !== y.length)
        return null

    return LeastSquaresRegressionFactory[type]({ x, y, ...props })
}

module.exports = {
    polynomial,
    logarithmic,
    exponential,
    power,
    leastSquaresRegression
}