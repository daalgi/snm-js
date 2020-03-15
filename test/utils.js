const { 
    areEqual, toDegrees, toRadians, sum, rnd,
    } = require("../src/utils")
const assert = require("chai").assert


describe("utils module", () => {
  
  describe("areEqual(): compares two numbers for a given tolerance (by default 1e-8)", () =>{
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

  describe("toDegrees(): converts radians to degrees", () =>{
      describe("an angle of PI/2 rad", () => {
          it("returns 90 degrees", () => {
              assert.equal(toDegrees(Math.PI/2), 90)
          })
      })
  })

  describe("toRadians(): converts degrees to radians", () =>{
      describe("an angle of 45 degrees", () => {
          it("returns PI/4 radians", () => {
              assert.equal(toRadians(45), Math.PI/4)
          })
      })
  })

  describe("sum(): the sum of the values of an array", () =>{
      describe("for [1, 2, 3, -5]", () => {
          it("returns 1", () => {
              let arr = [1, 2, 3, -5]
              assert.equal(sum(arr), 1)
          })
      })
  })

  describe("rnd(): a random number", () => {

      describe("by default", () => {
          it("returns a number between 0 and 1", () => {
              let r = rnd()
              assert.isAtLeast(r, 0)
              assert.isAtMost(r, 1)
          })
      })
      describe("with min = 8 and max = 10", () => {
          it("returns a number between 8 and 10", () =>{
              let r = rnd(8, 10)
              assert.isAtLeast(r, 8)
              assert.isAtMost(r, 10)
          })
      })
      describe("with min = -8 and max = -6", () => {
          it("returns a number between -8 and -6", () =>{
              let r = rnd(-8, -6)
              assert.isAtLeast(r, -8)
              assert.isAtMost(r, -6)
          })
      })

  })


})