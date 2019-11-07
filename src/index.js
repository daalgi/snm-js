import {
    trapezoidalForceIntegration,
    trapezoidalMomentIntegration,
    montecarlo
} from "./integration"
import {
    Matrix,
    Vector
} from "./linear-algebra";
import { 
    polynomial,
    logarithmic,
    exponential,
    power
} from "./regression";
import { 
    areEqual,
    toDegrees,
    toRadians,
    sum,
    rnd} from "./utils";

export { 
    trapezoidalForceIntegration, 
    trapezoidalMomentIntegration, 
    montecarlo as montecarloIntegration,
    
    Matrix, Vector,

    polynomial as polynomialRegression, 
    logarithmic as logarithmicRegression, 
    exponential as exponentialRegression, 
    power as powerRegression,

    areEqual, toDegrees, toRadians, sum, rnd,
}
// TUTORIAL TO BUILD A PACKAGE
//https://medium.com/the-andela-way/build-and-publish-your-first-npm-package-a4daf0e2431