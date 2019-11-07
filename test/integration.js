//import { 
const {
    trapezoidalForceIntegration, 
    trapezoidalMomentIntegration,
    resultantStretches
 } = require("../src/integration")

//import assert from ("chai").assert;
const assert = require("chai").assert;


describe("trapezoidalForceIntegration: given two arrays of points x, f(x), integrates f(x) dx", () =>{

    it("different arrays size error", () => {
        let x = [0, 1]
        let f = [1, 1, 1]
        assert.throws(() => {trapezoidalForceIntegration({x, f})}, 
                      Error, "The length of the vectors x and y must be equal")
    })

    it("area of a rectangle", () => {
        let x = [0, 1]
        let f = [1, 1]
        assert.equal(trapezoidalForceIntegration({x, f}), 1)
    })

    it("area of rectangle-triangle", () => {
        let x = [0, 1]
        let f = [1, 2]
        assert.equal(trapezoidalForceIntegration({x, f}), 1.5)
    })

    it("area of complex rectangle-triangle", () => {
        let x = [0, 1, 2, 3, 4, 5]
        let f = [1, 2, 2, 3, 2, 1]
        assert.equal(trapezoidalForceIntegration({x, f}), 10)
    })

    it("area of positive-negative triangle", () => {
        let x = [0, 1]
        let f = [-1, +1]
        assert.equal(trapezoidalForceIntegration({x, f}), 0)
    })

    it("area of complex positive-negative triangles", () => {
        let x = [0, 1, 2, 3]
        let f = [-1, 0, 1, 0]
        assert.equal(trapezoidalForceIntegration({x, f}), 0.5)
    })
})


describe("trapezoidalMomentIntegration: given two arrays of points x, f(x), integrates f(x) x dx", () =>{

    it("different arrays size error", () => {
        let x = [0, 1]
        let f = [1, 1, 1]
        assert.throws(() => {trapezoidalMomentIntegration({x, f})}, 
                      Error, "The length of the vectors x and y must be equal")
    })
    
    it("area*x_centroid of a rectangle", () => {
        let x = [0, 1]
        let f = [1, 1]
        assert.equal(trapezoidalMomentIntegration({x, f}), 0.5)
    })
    
    it("area*x_centroid of rectangle-triangle", () => {
        let x = [0, 1]
        let f = [1, 2]
        assert.equal(trapezoidalMomentIntegration({x, f}), 1*0.5+1/2*(0+2/3))
    })
    
    it("area*x_centroid of complex rectangle-triangle", () => {
        let x = [0, 1, 2, 3, 4, 5]
        let f = [1, 2, 2, 3, 2, 1]
        let handCalc = 8*2.5+0.5*2/3+0.5*(2+2/3)+0.5*(3+1/3)+0.5*(4+1/3)
        assert.equal(trapezoidalMomentIntegration({x, f}), handCalc)
    })
    
    it("area*x_centroid of positive-negative triangle", () => {
        let x = [0, 1, 2]
        let f = [-1, 0, +1]
        let handCalc = - 1/2 * (1/3) + 1/2 * (1 + 2/3)
        assert.closeTo(trapezoidalMomentIntegration({x, f}), handCalc, 1e-15)
    })

    it("area*x_centroid of positive-negative triangle defining xref at the centroid of the area", () => {
        let x = [0, 1, 2]
        let f = [-1, 0, +1]
        let xref = 1
        let handCalc = 2 * (1/2 * 2/3)
        assert.closeTo(trapezoidalMomentIntegration({x, f, xref}), handCalc, 1e-15)
    })

    it("area of complex positive-negative triangles", () => {
        let x = [0, 1, 2, 3]
        let f = [-1, 0, 1, 0]
        let handCalc = -1/2 * (1/3) + 1/2 * (1 + 2/3) + 1/2 * (2 + 1/3)
        assert.closeTo(trapezoidalMomentIntegration({x, f}), handCalc, 1e-15)
    })
})

describe('resultantStretches() divides a function into the different stretches with the same sign.', () => {

    it('at least two points error', () => {
        let x = [0]
        let y = [1]
        assert.throws(() => {resultantStretches({ p: x, r: y })},
                      Error, "The path should have at least two points")
    })

    it('path and results must have the same length error', () => {
        let x = [0, 5]
        let y = [1, 3, 8]
        assert.throws(() => {resultantStretches({ p: x, r: y })},
                      Error, "The path and the results arrays must have the same length")
        
        x = [0, 5]
        y = [1]
        assert.throws(() => {resultantStretches({ p: x, r: y })},
                      Error, "The path and the results arrays must have the same length")
    })

    it('returns the expected object for a constant distribution', () => {
        let x = [-1, 1]
        let y = [1, 1]
        
        let res = resultantStretches({ p: x, r: y })

        assert.isArray(res)
        assert.equal(res.length, 1)
        assert.isObject(res[0])
        assert.equal(res[0].path_i, -1)
        assert.equal(res[0].path_f, +1)
        assert.equal(res[0].resultant, 2)
        //assert.equal(res[0].centroid, 0)
    })

    it('returns the expected object for another constant distribution', () => {
        let x = [0, 1]
        let y = [1, 1]
        
        let res = resultantStretches({ p: x, r: y })

        assert.isArray(res)
        assert.equal(res.length, 1)
        assert.isObject(res[0])
        assert.equal(res[0].path_i, 0)
        assert.equal(res[0].path_f, +1)
        assert.equal(res[0].resultant, 1)
        assert.equal(res[0].centroid, 0.5)
    })

    it('returns the expected object for yet another constant distribution', () => {
        let x = [0, 1]
        let y = [-1, -1]
        
        let res = resultantStretches({ p: x, r: y })

        assert.isArray(res)
        assert.equal(res.length, 1)
        assert.isObject(res[0])
        assert.equal(res[0].path_i, 0)
        assert.equal(res[0].path_f, +1)
        assert.equal(res[0].resultant, -1)
        assert.equal(res[0].centroid, 0.5)
    })

    it('returns the expected object for a one stretch triangular distribution (3 points, including x = 0)', () => {
        let x = [-1, 0, 1]
        let y = [0, 1, 2]
        
        let res = resultantStretches({ p: x, r: y })

        assert.isArray(res)
        assert.equal(res.length, 1)
        assert.isObject(res[0])
        assert.equal(res[0].path_i, -1)
        assert.equal(res[0].path_f, +1)
        assert.equal(res[0].resultant, 1/2 * 2 * 2)
        assert.closeTo(res[0].centroid, 2 * 2/3 -1, 1e-15)
    })

    it('returns the expected object for a one stretch positive triangular distribution (3 points, not including x = 0)', () => {
        let x = [-1, 1, 2]
        let y = [0, 2, 3]
        
        let res = resultantStretches({ p: x, r: y })

        assert.isArray(res)
        assert.equal(res.length, 1)
        assert.isObject(res[0])
        assert.equal(res[0].path_i, -1)
        assert.equal(res[0].path_f, +2)
        assert.equal(res[0].resultant, 1/2 * 3 * 3)
        assert.closeTo(res[0].centroid, 3 * 2/3 - 1, 1e-15)
    })

    it('returns the expected object for a two stretches (negative and positive) triangular distribution', () => {
        let x = [-1, 1]
        let y = [-1, 1]
        
        let res = resultantStretches({ p: x, r: y })

        assert.isArray(res)
        assert.equal(res.length, 2)

        assert.isObject(res[0])
        assert.equal(res[0].path_i, -1)
        assert.equal(res[0].path_f, 0)
        assert.equal(res[0].resultant, -1/2)
        assert.closeTo(res[0].centroid, -2/3, 1e-15)

        assert.isObject(res[1])
        assert.equal(res[1].path_i, 0)
        assert.equal(res[1].path_f, +1)
        assert.equal(res[1].resultant, 1/2)
        //console.log(res)
        /*assert.closeTo(res[1].centroid, 2/3, 1e-15)*/
    })
    
})
