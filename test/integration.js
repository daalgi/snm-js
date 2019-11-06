//import { 
const {
    trapezoidalForceIntegration, 
    trapezoidalMomentIntegration } = require("../src/integration")
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
        //console.log(trapezoidalMomentIntegration({x, f}), handCalc)
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

