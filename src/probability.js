/**
 * Random number within an interval
 * @param {number} min 
 * @param {number} max 
 * @returns {number} random number within the interval [min, max]
 */
const randomInterval = (min = 0, max = 1) => {
    return Math.random() * (max - min) + min;
}


/**
 * Marsaglia polar method to generate random gaussian numbers
 * @param {Number} mean 
 * @param {Number} stdDev 
 * @returns {Number}
 */
const randomFromNormalDistribution = (mean, stdDev) => {
    let u, v, s
    do {
        u = Math.random() * 2 - 1
        v = Math.random() * 2 - 1
        s = u * u + v * v
    } while (s >= 1 || s == 0)
    s = Math.sqrt(-2.0 * Math.log(s) / s)

    return mean + stdDev * u * s
}

/**
 * Given a population with a normal distribution compute the mean and standard deviation
 * @param {Array} arr - Array filled of numbers representing the population to be studied
 * @returns {Object} - { mean, standardDeviation }
 */
const normalDistribution = arr => {
    const n = arr.length
    if (n > 0) {
        const m = arr.reduce((acc, v) => acc + v) / n
        return {
            mean: m,
            standardDeviation: Math.sqrt(arr.map(x => Math.pow(x - m, 2)).reduce((acc, v) => acc + v) / n)
        }
    }
    return {}
}

module.exports = {
    standardDeviation,
    randomInterval,
    randomFromNormalDistribution,
    normalDistribution
}