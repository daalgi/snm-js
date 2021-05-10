const { Vector } = require("../src/linearAlgebra");
const assert = require("chai").assert;

describe("linear-algebra module - Matrix object", () => {
  
  describe("Vector class defines a vector", () =>{
      describe("Vector(1, 2, 3) and Vector(-1, -1, 2)", () => {
          const v = new Vector(1, 2, 3);
          const w = new Vector(-1, -1, 2);
          let res = undefined;
          it("should have three components", () => {            
              assert.equal(v.components.length, 3);
              assert.equal(w.components.length, 3);
          });
          it("should add up Vector(0, 1, 5)", () => {
              res = v.add(w);
              assert.deepEqual(res.components, [0, 1, 5]);
              assert.deepEqual(res, new Vector(0, 1, 5));
          });
          it("the difference should be Vector(2, 3, 1)", () => {
              res = v.subtract(w);
              assert.deepEqual(res.components, [2, 3, 1]);
              assert.deepEqual(res, new Vector(2, 3, 1));
          });
          it("scaled by 2 should be Vector(2, 4, 6) and Vector(-2, -2, 4)", () =>{
              assert.deepEqual(v.scaleBy(2), new Vector(2, 4, 6));
              assert.deepEqual(w.scaleBy(2), new Vector(-2, -2, 4));
          })
          it("should have a length of 3.741657... and 2.449489...", () =>{
              assert.closeTo(v.length(), Math.sqrt(1+4+9), 1e-15);
              assert.equal(w.length(), Math.sqrt(1+1+4));
          })
          it("the dot product shoudl be 3", () => {
              assert.equal(v.dotProduct(w), -1-2+6);
          })
          it("should have the dot product shoudl be 3", () => {
              assert.equal(v.dotProduct(w), -1-2+6);
          })
      });

  });
});