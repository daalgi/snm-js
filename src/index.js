import {
    randomPointInBox,
    boundingBoxAddition,
    boundingBoxArea,
    boundingBoxVolume,
    findLineXaxisIntersection,
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
    gaussLegendre,
    gaussLegendreByIntervals,
    montecarlo
} from "./integration"
import {
    Matrix,
    Vector
} from "./linearAlgebra"
import {
    polynomial,
    logarithmic,
    exponential,
    power,
    leastSquaresRegression
} from "./regression"
import {
    areEqual,
    toDegrees,
    toRadians,
    sum,
} from "./utils"

export {
    trapezoidalForceIntegration,
    trapezoidalMomentIntegration,
    gaussLegendre,
    gaussLegendreByIntervals,
    montecarlo as montecarloIntegration,

    Matrix, Vector,

    polynomial as polynomialRegression,
    logarithmic as logarithmicRegression,
    exponential as exponentialRegression,
    power as powerRegression,
    leastSquaresRegression,

    areEqual, toDegrees, toRadians, sum,
}
// TUTORIAL TO BUILD A PACKAGE
//https://medium.com/the-andela-way/build-and-publish-your-first-npm-package-a4daf0e2431