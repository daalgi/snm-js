const {
    areEqual, round, roundToFixed,
    toDegrees, toRadians, 
    sum, 
    piecewiseLinearInterpolation
} = require("../src/utils")
const assert = require("chai").assert


describe("utils module", () => {

    describe("areEqual(): compares two numbers for a given tolerance (by default 1e-8)", () => {
        describe("1 and 1.00001", () => {
            it("returns false", () => {
                assert.equal(areEqual(1, 1.00001), false)
            })
        })
        describe("1 and 1.000000001", () => {
            it("returns true", () => {
                assert.equal(areEqual(1, 1.000000001), true)
            })
        })
    })

    describe("round(): rounds a number (by default 2 decimals)", () => {
        describe("round(8.13, 1)", () => {
            it("returns 8.1", () => {
                assert.equal(round(8.13, 1), 8.1)
            })
        })
        describe("round(8.13, 0)", () => {
            it("returns 8", () => {
                assert.equal(round(8.13, 0), 8)
            })
        })
        describe("round(8.1393)", () => {
            it("returns 8.14", () => {
                assert.equal(round(8.1393), 8.14)
            })
        })
        describe("round(8.1393, 6)", () => {
            it("returns 8.1393", () => {
                assert.equal(round(8.1393, 6), 8.1393)
            })
        })
        describe("round(0, 6)", () => {
            it("returns 0", () => {
                assert.equal(round(0, 6), 0)
            })
        })
    })

    describe("roundToFixed(): rounds a number and converts it into a string with fixed decimals", () => {
        describe("roundToFixed(8.13, 1)", () => {
            it("returns 8.1", () => {
                assert.equal(roundToFixed(8.13, 1), "8.1")
            })
        })
        describe("roundToFixed(8.13, 0)", () => {
            it("returns 8", () => {
                assert.equal(roundToFixed(8.13, 0), "8")
            })
        })
        describe("roundToFixed(8.1393)", () => {
            it("returns 8.14", () => {
                assert.equal(roundToFixed(8.1393), "8.14")
            })
        })
        describe("roundToFixed(8.1393, 6)", () => {
            it("returns 8.1393", () => {
                assert.equal(roundToFixed(8.1393, 6), "8.139300")
            })
        })
        describe("roundToFixed(0, 6)", () => {
            it("returns 0", () => {
                assert.equal(roundToFixed(0, 6), "0.000000")
            })
        })
    })

    describe("toDegrees(): converts radians to degrees", () => {
        describe("an angle of PI/2 rad", () => {
            it("returns 90 degrees", () => {
                assert.equal(toDegrees(Math.PI / 2), 90)
            })
        })
    })

    describe("toRadians(): converts degrees to radians", () => {
        describe("an angle of 45 degrees", () => {
            it("returns PI/4 radians", () => {
                assert.equal(toRadians(45), Math.PI / 4)
            })
        })
    })

    describe("sum(): the sum of the values of an array", () => {
        describe("for [1, 2, 3, -5]", () => {
            it("returns 1", () => {
                let arr = [1, 2, 3, -5]
                assert.equal(sum(arr), 1)
            })
        })
    })

    describe("piecewiseLinearInterpolation(): given two arrays of X and Y", () => {
        let arrX = [0, 1, 2, 4, 5]
        let arrY = [0, 1, 2, 4, 6]

        it("returns y=1.5 for an intermediate value (x=1.5) ", () => {
            let x = 1.5
            let y = piecewiseLinearInterpolation(arrX, arrY, x)
            assert.equal(y, 1.5)
        })
        it("returns y=3 for an intermediate value (x=3) ", () => {
            let x = 3
            let y = piecewiseLinearInterpolation(arrX, arrY, x)
            assert.equal(y, 3)
        })
        it("returns y=5 for an intermediate value (x=4.5) ", () => {
            let x = 4.5
            let y = piecewiseLinearInterpolation(arrX, arrY, x)
            assert.equal(y, 5)
        })

        it("returns y=0 for an exact value (x=0) ", () => {
            let x = 0
            let y = piecewiseLinearInterpolation(arrX, arrY, x)
            assert.equal(y, 0)
        })
        it("returns y=6 for an exact value (x=5) ", () => {
            let x = 5
            let y = piecewiseLinearInterpolation(arrX, arrY, x)
            assert.equal(y, 6)
        })

        it("X value smaller than the minimum in arrX (extrapolation)", () => {
            let x = -1
            let y = piecewiseLinearInterpolation(arrX, arrY, x)
            assert.equal(y, -1)
        })

        it("X value greater than the maximum in arrX (extrapolation)", () => {
            let x = 6
            let y = piecewiseLinearInterpolation(arrX, arrY, x)
            assert.equal(y, 8)
        })
    })

})