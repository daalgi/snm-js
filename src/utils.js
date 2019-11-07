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

/**
 * Given a line defined by two points (x1, y1) and (x2, y2), compute the its intersection with the x-axis
 * @param {number} x1 x-coordinate of the point 1
 * @param {number} y1 y-coordinate of the point 1
 * @param {number} x2 x-coordinate of the point 2
 * @param {number} y2 y-coordinate of the point 2  
 * @returns {number} x-coordinate of the intersection of the line with the x-axis
 */
const findLineXaxisIntersection = ({ x1, y1, x2, y2 }) => {
  if(y1 - y2 === 0) throw new Error("The line is parallel to the X-axis")
  return x1 - (x2 - x1) / (y2 - y1) * y1
}

module.exports = {
    areEqual,
    toDegrees,
    toRadians,
    sum,
    rnd,
    findLineXaxisIntersection
  }