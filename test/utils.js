const { 
    areEqual, toDegrees, toRadians, sum, rnd,
    findLineXaxisIntersection } 
    = require("../src/utils")
const assert = require("chai").assert


describe("utils.areEqual: compares two numbers for a given tolerance (by default 1e-8)", () =>{
    describe("1 and 1.00001", () => {
        it("should return false", () => {
            assert.equal(areEqual(1, 1.00001), false)
        })
    })
    describe("1 and 1.000000001", () => {
        it("should return true", () => {
            assert.equal(areEqual(1, 1.000000001), true)
        })
    })
})

describe("utils.toDegrees: converts radians to degrees", () =>{
    describe("an angle of PI/2 rad", () => {
        it("should return 90 degrees", () => {
            assert.equal(toDegrees(Math.PI/2), 90)
        })
    })
})

describe("utils.toRadians: converts degrees to radians", () =>{
    describe("an angle of 45 degrees", () => {
        it("should return PI/4 radians", () => {
            assert.equal(toRadians(45), Math.PI/4)
        })
    })
})

describe("utils.sum: the sum of the values of an array", () =>{
    describe("for [1, 2, 3, -5]", () => {
        it("should return 1", () => {
            let arr = [1, 2, 3, -5]
            assert.equal(sum(arr), 1)
        })
    })
})

describe("utils.rnd: a random number", () => {

    describe("by default", () => {
        it("should return a number between 0 and 1", () => {
            let r = rnd()
            assert.isAtLeast(r, 0)
            assert.isAtMost(r, 1)
        })
    })
    describe("with min = 8 and max = 10", () => {
        it("should return a number between 8 and 10", () =>{
            let r = rnd(8, 10)
            assert.isAtLeast(r, 8)
            assert.isAtMost(r, 10)
        })
    })
    describe("with min = -8 and max = -6", () => {
        it("should return a number between -8 and -6", () =>{
            let r = rnd(-8, -6)
            assert.isAtLeast(r, -8)
            assert.isAtMost(r, -6)
        })
    })

})

describe("utils.findLineXaxisIntersection: returns the x-coordinate of the intersection between a given line and the x-axis", () =>{
    it("Line (-1, -1), (1, 1) returns the expected intersection", () => {
        assert.equal(findLineXaxisIntersection({ x1: -1, y1: -1, x2: 1, y2: 1 }), 0)    
    })

    it("Line (-1, 2), (1, 2) throws a line parallel to x-axis error", () => {
        assert.throws(() => { findLineXaxisIntersection({ x1: -1, y1: 2, x2: 1, y2: 2 }) }, 
                      Error, "The line is parallel to the X-axis")    
    })
})