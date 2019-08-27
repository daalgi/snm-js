const EPSILON = 1e-8

const areEqual = (one, other, epsilon = EPSILON) => Math.abs(one - other) < epsilon;

const toDegrees = radians => radians * 180 / Math.PI;

const toRadians = degrees => degrees * Math.PI / 180;

const sum = arr => arr.reduce((acc, value) => acc + value, 0)

// Random number between two values
const rnd = (min = 0, max = 1) => {
  //if(typeof max === "undefined") max = 0;
  return Math.random() * (max - min) + min;
}

module.exports = {
    areEqual,
    toDegrees,
    toRadians,
    sum,
    rnd
    //withoutElementAtIndex
  }