const { brent } = require("../src/rootFinding")
const assert = require("chai").assert


describe("rootFinding module", () => {

    let errorTol = 1e-7

    describe("solveBrent(): returns the first root found for a function", () => {

        describe("f(x) = x + 2", () => {
            let f = x => x + 2
            it("returns -2", () => {
                let lowerLimit = -10
                let upperLimit = 10
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), -2, errorTol)
            })
        })

        describe("f(x) = x + 12", () => {
            let f = x => x + 12
            it("within the interval [-10, 10], returns -10, due to the interal definition", () => {
                let lowerLimit = -10
                let upperLimit = 10
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), -10, errorTol)
            })
            it("within the interval [-100, 100], returns -12 (wrong root), due to the absence of a root within the interval", () => {
                let lowerLimit = -100
                let upperLimit = 100
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), -12, errorTol)
            })
        })

        describe("f(x) = x^2 - x - 2", () => {
            let f = x => x * x - x - 2
            it("within the interval [-10, 10], returns -1, as the first root found", () => {
                let lowerLimit = -10
                let upperLimit = 10
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), -1, errorTol)
            })
            it("within the interval [0, 10], returns +2, as the first root found", () => {
                let lowerLimit = 0
                let upperLimit = 10
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), +2, errorTol)
            })
            it("within the interval [5, 10], returns +5 (wrong root), due to the absence of a root within the interval", () => {
                let lowerLimit = 5
                let upperLimit = 10
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), +5, errorTol)
            })
        })

        describe("f(x) = 3 * cos(x) * sin(x)", () => {
            // In periodic function functions, if the interval contains multiple roots,
            // it's not easy to guess which one will be the first found
            let f = x => 3 * Math.cos(x) * Math.sin(x)
            it("within the interval [-1, 1], returns 0, as the first root found", () => {
                let lowerLimit = -1
                let upperLimit = 1
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), 0, errorTol)
            })
            it("within the interval [1, 2], returns +PI/2, as the first root found", () => {
                let lowerLimit = 1
                let upperLimit = 2
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), Math.PI / 2, errorTol)
            })
            it("within the interval [-PI/2-0.2, -0.1], returns -PI/2, as the first root found", () => {
                let lowerLimit = -Math.PI / 2 - 0.2
                let upperLimit = -0.1
                assert.closeTo(brent(f, lowerLimit, upperLimit, errorTol), -Math.PI / 2, errorTol)
            })
        })

    })

})