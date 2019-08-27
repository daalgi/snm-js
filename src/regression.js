const { Matrix } = require("./matrix");
const { Vector } = require("./vector");
const { sum } = require("./utils");

/* -------------------------------------------
    Metrics to evaluate a regression model
 --------------------------------------------- */
const metrics = ({x, y, func, coefs}) => {
    return {
        meanAbsoluteError: meanAbsoluteError({x, y, func}),
        meanSquaredError: meanSquaredError({x, y, func}),
        rootMeanSquaredError: rootMeanSquaredError({x, y, func}),
        meanAbsolutePercentageError: meanAbsolutePercentageError({x, y, func}),
        r2score: r2score({x, y, func}),
        r2scoreAdjusted: r2scoreAdjusted({x, y, func, coefs}),
    };
}

const meanAbsoluteError = ({x, y, func}) => {
    return sum(y.map((y, i) => Math.abs(y - func(x[i])))) / x.length;
}
const meanSquaredError = ({x, y, func}) => {
    return sum(y.map((y, i) => Math.pow(y - func(x[i]), 2))) / x.length;
}
const rootMeanSquaredError = ({x, y, func}) => {
    return Math.sqrt(meanSquaredError({x, y, func}));
}
const meanAbsolutePercentageError = ({x, y, func}) => {
    return 100/x.length * sum(y.map((y, i) => Math.abs((y - func(x[i])/y))));
}
const totalSumSquares = ({x, y, func}) => {
    let yMean = sum(y) / y.length;
    return sum(y.map(y => Math.pow(y - yMean, 2)));
}
const residualSumSquares = ({x, y, func}) => {
    return sum(y.map((y, i) => Math.pow(y - func(x[i]), 2)));
}
const r2score = ({x, y, func}) => {        
    return 1 - residualSumSquares({x, y, func}) / totalSumSquares({x, y, func});
}
const r2scoreAdjusted = ({x, y, func, coefs}) => {        
    let r2 = r2score({x, y, func});
    let n = x.length;
    let num_coefs = coefs.length;
    return 1 - (1 - r2) * ((n - 1) / (n - (num_coefs + 1)));
}

/* -------------------------------------------
    Regression models
 --------------------------------------------- */
// y = x0 + x1 * x + x2 * x^2 + x3 * x^3 + ... + xn * x^n
const polynomial = ({ x, y, order = 2}) => {
    if(typeof x !== "object" || typeof y !== "object")
        throw new Error("x and y should be arrays");
    if(x.length !== y.length)
        throw new Error("the length of the arrays x and y should be the same");

    // Solution of the linear system of equations
    const matA = new Matrix(...new Array(x.length)
        .fill()
        .map((_, i) =>
        new Array(order + 1).fill().map((_, j) => x[i] ** (order - j)))
    );
    const mat_AtA_inv = matA.transpose().multiply(matA).inverse();
    let yVector = new Vector(...y);
    const vec_Aty = yVector.transform(matA.transpose());    
    const coefs = vec_Aty.transform(mat_AtA_inv).toArray();

    // Predict function
    const predict = (x) => {
        return sum(coefs.map((coef, i) => coef * Math.pow(x, coefs.length-i-1)));
    };

    //return {coefs, predict, r2};
    return {coefs, predict, metrics: metrics({x, y, func: predict, coefs})};
}

/* Logarithmic regression: y = a + b log(x)
    (Math.log(x) = ln(x) in mathematics)    
    source: http://mathworld.wolfram.com/LeastSquaresFittingLogarithmic.html
*/
const logarithmic = ({x, y}) => {
    let sum_logxi = sum(x.map(x => Math.log(x)));
    let sum_logxi2 = sum(x.map(x => Math.pow(Math.log(x), 2)));
    let sum_yilogxi = sum(x.map((x, i) => y[i] * Math.log(x)));
    let sum_yi = sum(y);
    let n = x.length;
    let denom = n * sum_logxi2 - Math.pow(sum_logxi, 2);
    let b = (n * sum_yilogxi - sum_yi * sum_logxi) / denom;
    let a = (sum_yi - b * sum_logxi) / n;
    
    let coefs = [a, b];

    // Predict function
    const predict = (x) => {
        return coefs[0] + coefs[1] * Math.log(x);
    };

    return {coefs, predict};
}

/* Exponential regression: y = a * exp(b * x)
    source: http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
*/
const exponential = ({x, y}) => {
    let sum_xi = sum(x);
    let sum_xi2 = sum(x.map(v => v * v));
    let sum_logyi = sum(y.map(v => Math.log(v)));
    let sum_xilogyi = sum(x.map((v, i) => v * Math.log(y[i])));
    let denom = x.length * sum_xi2 - Math.pow(sum_xi, 2);
    let a = (sum_logyi * sum_xi2 - sum_xi * sum_xilogyi) / denom;
    let b = (x.length * sum_xilogyi - sum_xi * sum_logyi) / denom;
    
    let coefs = [Math.exp(a), b];

    // Predict function
    const predict = (x) => {
        return coefs[0] * Math.exp(coefs[1] * x);
    };
    
    return {coefs, predict};
}

/* Power Law regression: y = a x^b
    source: http://mathworld.wolfram.com/LeastSquaresFittingPowerLaw.html
    TODO: check log(0) values
*/
const power = ({x, y}) => {
    let sum_logxi = sum(x.map(v => Math.log(v)));
    let sum_logxi2 = sum(x.map(v => Math.pow(Math.log(v), 2)));
    let sum_logyi = sum(y.map(v => Math.log(v)));
    let sum_logxilogyi = sum(x.map((v, i) => Math.log(v) * Math.log(y[i])));
    let n = x.length;
    let denom = n * sum_logxi2 - Math.pow(sum_logxi, 2);
    let b = (n * sum_logxilogyi - sum_logxi * sum_logyi) / denom;
    let a = (sum_logyi - b * sum_logxi) / n;

    let coefs = [Math.exp(a), b];

    // Predict function
    const predict = (x) => {
        return coefs[0] * Math.pow(x, coefs[1]);
    };
    
    return {coefs, predict};
}

module.exports = {
    polynomial,
    logarithmic,
    exponential,
    power
}