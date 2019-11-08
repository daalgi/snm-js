const EPSILON = 1e-8
/**
 * Compare two numbers (one, other) and see if the difference is less than a given tolerance (epsilon)
 * @param {number} one 
 * @param {number} other 
 * @param {number} epsilon tolerance to consider two numbers equal
 */
const areEqual = (one, other, epsilon = EPSILON) => Math.abs(one - other) < epsilon;

/**
 * Convert radians into degrees
 * @param {number} radians 
 */
const toDegrees = radians => radians * 180 / Math.PI;

/**
 * Convert degrees into radians
 * @param {number} degrees 
 */
const toRadians = degrees => degrees * Math.PI / 180;

const sum = arr => arr.reduce((acc, value) => acc + value, 0)

/**
 * Random number within an interval
 * @param {number} min 
 * @param {number} max 
 * @returns {number} random number within the interval [min, max]
 */
const rnd = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
}


module.exports = {
    areEqual,
    toDegrees,
    toRadians,
    sum,
    rnd
  }