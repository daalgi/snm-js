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
    trapezoidalForceIntegration, trapezoidalMomentIntegration, montecarlo,
    Matrix, Vector,
    polynomial, logarithmic, exponential, power,
    areEqual, toDegrees, toRadians, sum, rnd,
}
// TUTORIAL TO BUILD A PACKAGE
//https://medium.com/the-andela-way/build-and-publish-your-first-npm-package-a4daf0e2431