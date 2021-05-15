import {
    randomPointInBox,
    boundingBoxAddition,
    boundingBoxArea, 
    boundingBoxVolume,
    findLineXaxisIntersection,
    Rectangle, 
    Circle, 
    RectangularPrism, 
    Sphere, 
    Cone,
    Point2d, 
    Line2d
} from "./geometry"

import {
    trapezoidalForceIntegration, 
    trapezoidalMomentIntegration,
    resultantStretches,
    gaussLegendre,
    gaussLegendreByIntervals,
    montecarlo
} from "./integration"

import {
    Matrix,
    Vector
} from "./linearAlgebra"

import {
    randomInRange,
    randomFromNormalDistribution,
    standardDeviation,
    normalDistribution
} from "./probability"

import {
    //computeMetrics,
    meanAbsoluteError,
    meanSquaredError,
    rootMeanSquaredError,
    meanAbsolutePercentageError,
    totalSumSquares,
    residualSumSquares,
    r2score,
    r2scoreAdjusted,
    polynomialEquationToString,
    polynomial,
    logarithmic,
    exponential,
    power,
    LeastSquaresRegressionFactory,
    leastSquaresRegression
} from "./regression"

import {
    brent
} from "./rootFinding"

import {
    areEqual,
    round,
    roundToFixed,
    toDegrees,
    toRadians,
    sum,
    piecewiseLinearInterpolation,
    factorial
} from "./utils"

export {
    randomPointInBox,
    boundingBoxAddition,
    boundingBoxArea, 
    boundingBoxVolume,
    findLineXaxisIntersection,
    Rectangle, 
    Circle, 
    RectangularPrism, 
    Sphere, 
    Cone,
    Point2d, 
    Line2d,

    trapezoidalForceIntegration, 
    trapezoidalMomentIntegration,
    resultantStretches,
    gaussLegendre,
    gaussLegendreByIntervals,
    montecarlo as montecarloIntegration,

    Matrix, 
    Vector,

    randomInRange,
    randomFromNormalDistribution,
    standardDeviation,
    normalDistribution,

    meanAbsoluteError,
    meanSquaredError,
    rootMeanSquaredError,
    meanAbsolutePercentageError,
    totalSumSquares,
    residualSumSquares,
    r2score,
    r2scoreAdjusted,
    polynomialEquationToString,
    polynomial,
    logarithmic,
    exponential,
    power,
    LeastSquaresRegressionFactory,
    leastSquaresRegression,

    brent,
    
    areEqual,
    round,
    roundToFixed,
    toDegrees,
    toRadians,
    sum,
    piecewiseLinearInterpolation,
    factorial
}

// TUTORIAL TO BUILD A PACKAGE
//https://medium.com/the-andela-way/build-and-publish-your-first-npm-package-a4daf0e2431
//https://betterstack.dev/blog/npm-package-best-practices/#heading-directory-structure-conventions