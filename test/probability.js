const {
    randomInRange,
    randomFromNormalDistribution
} = require("../src/probability")
const assert = require("chai").assert


describe("probability module", () => {

    describe("randomInRange(): generates a number within a range", () => {
        describe("randomInRange(1, 2)", () => {
            it("returns a number within 1 and 2", () => {
                let r = randomInRange(1, 2)
                assert.isAtLeast(r, 1)
                assert.isBelow(r, 2)
            })
        })
        describe("by default", () => {
            it("returns a number between 0 and 1", () => {
                let r = randomInRange()
                assert.isAtLeast(r, 0)
                assert.isAtMost(r, 1)
            })
        })
        describe("with min = 8 and max = 10", () => {
            it("returns a number between 8 and 10", () => {
                let r = randomInRange(8, 10)
                assert.isAtLeast(r, 8)
                assert.isAtMost(r, 10)
            })
        })
        describe("with min = -8 and max = -6", () => {
            it("returns a number between -8 and -6", () => {
                let r = randomInRange(-8, -6)
                assert.isAtLeast(r, -8)
                assert.isAtMost(r, -6)
            })
        })
    })

    describe("randomFromNormalDistribution(): random number given a normal distribution", () => {
        describe("10000 iterations of randomFromNormalDistribution(80, 20)", () => {
            let av = 0
            for (let i = 0; i < 10000; i++) {
                av += randomFromNormalDistribution(80, 10)
            }
            av /= 10000
            it("returns a number close to 80", () => {
                assert.closeTo(av, 80, 1)
            })
        })
    })

})