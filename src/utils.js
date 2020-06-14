const EPSILON = 1e-8
/**
 * Compare two numbers (one, other) and see if the difference is less than a given tolerance (epsilon)
 * @param {number} one 
 * @param {number} other 
 * @param {number} epsilon tolerance to consider two numbers equal
 * @returns {Boolean}
 */
const areEqual = (one, other, epsilon = EPSILON) => Math.abs(one - other) < epsilon;

/**
 * Convert radians into degrees
 * @param {number} radians 
 * @returns {Number}
 */
const toDegrees = radians => radians * 180 / Math.PI;

/**
 * Convert degrees into radians
 * @param {number} degrees 
 * @returns {Number}
 */
const toRadians = degrees => degrees * Math.PI / 180;

/**
 * Sum of the elements of an array
 * @param {Array} arr - array filled with numeric values
 * @returns {Number}
 */
const sum = arr => {
  if (!Array.isArray(arr)) throw Error("The input must be an array")

  return arr.reduce((acc, value) => !isNaN(value) ? acc + value : acc, 0)
}

/**
 * Random number within an interval
 * @param {number} min 
 * @param {number} max 
 * @returns {number} random number within the interval [min, max]
 */
const rnd = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
}

/**
 * Standard deviation
 * @param {Array} arr
 * @returns {Number} 
 */
const standardDeviation = arr =>
    Math.sqrt(arr.map(x => Math.pow(x - m, 2)).reduce((acc, v) => acc + v) / n)

/**
 * Linear interpolation
 * TO BE REMOVED!!
 * @param {Array} arrX ascending sorted array of numbers
 * @param {Array} arrY array of numbers (function values)
 * @param {number} x
 * @returns {Object}
 */
const linearInterpolation = (arrX = [], arrY = [], x) => {
  if (!Array.isArray(arrX) || !Array.isArray(arrY))
    throw Error("arrX and arrY must be arrays of numbers.")
  if (arrX.length !== arrY.length && arrX.length > 1)
    throw Error("arrX and arrY must have the same length, always greater than 1.")

  let x0, y0, x1, y1
  let x0Index, x1Index
  let filteredArrX = arrX.filter(v => v < x)
  x0 = filteredArrX.slice(-1)[0]

  if (filteredArrX.length === 0) {
    // x value smaller than the minimum value of the arrX
    // extrapolation
    x0 = arrX[0]
  }

  x0Index = arrX.indexOf(x0)
  if (x0Index === arrX.length - 1) {
    // x value greater than the maximum value of the arrX
    // extrapolation
    x0Index--
    x0 = arrX[x0Index]
  }

  y0 = arrY[x0Index]
  x1Index = x0Index + 1
  x1 = arrX[x1Index]
  y1 = arrY[x1Index]

  return y0 + (y1 - y0) / (x1 - x0) * (x - x0)
}

const factorial = n => n <= 1 ? 1 : n * factorial(n - 1)

module.exports = {
  areEqual,
  toDegrees,
  toRadians,
  sum,
  rnd,
  linearInterpolation,
  factorial
}