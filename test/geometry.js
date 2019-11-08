const { 
    findLineXaxisIntersection 
  } = require("../src/geometry")
const assert = require("chai").assert


describe("geometry module", () => {
  
  describe("findLineXaxisIntersection(): returns the x-coordinate of the intersection between a given line and the x-axis", () =>{
      it("Line (-1, -1), (1, 1) returns the expected intersection", () => {
          assert.equal(findLineXaxisIntersection({ x1: -1, y1: -1, x2: 1, y2: 1 }), 0)    
      })

      it("Line (-1, 2), (1, 2) throws a line parallel to x-axis error", () => {
          assert.throws(() => { findLineXaxisIntersection({ x1: -1, y1: 2, x2: 1, y2: 2 }) }, 
                        Error, "The line is parallel to the X-axis")    
      })
  })
  
})