const {
    polynomial, logarithmic, exponential, power, leastSquaresRegression
} = require("../src/regression")
const assert = require("chai").assert

const checkCoeffs = ({ calcCoeffs, realCoeffs, tolerance = 1e-15 }) => {
    assert.equal(calcCoeffs.length, realCoeffs.length)
    for (let i = 0; i < calcCoeffs.length; i++) {
        assert.closeTo(calcCoeffs[i], realCoeffs[i], tolerance)
    }
}

const checkPredictions = ({ x, y, predict, tolerance = 1e-15 }) => {
    for (let i = 0; i < x.length; i++) {
        assert.closeTo(predict(x[i]), y[i], tolerance)
    }
}

describe("regression module", () => {
    
    describe("polynomial()", () => {
        describe("for a perfect dataset fitting into a straight line", () => {
            let x = [0, 1, 3, 4]
            let y = [1, 2, 4, 5]
            let model = polynomial({ x, y, order: 1 })
            let coeffs = [1, 1]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-15 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-15 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * x"
                let eqc = `y = ${model.coeffs[1]} + ${model.coeffs[0]} * x`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
        describe("for a perfect dataset fitting into a parabola", () => {
            let x = new Array(10).fill().map((_, i) => i)
            let y = x.map(x => 1 * x * x + 0 * x + 1)
            let model = polynomial({ x, y, order: 2 })
            let coeffs = [1, 0, 1]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-12 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-12 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * x + a2 * x^2"
                let eqc = `y = ${model.coeffs[2]} - ${Math.abs(model.coeffs[1])} * x + ${model.coeffs[0]} * x^2`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
        describe("for a perfect dataset fitting into a parabola with 100 points", () => {
            let x = new Array(100).fill().map((_, i) => i)
            let y = x.map(x => 10 * x * x - 100 * x + 13)
            let model = polynomial({ x, y, order: 2 })
            let coeffs = [10, -100, 13]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-10 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-9 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * x + a2 * x^2"
                let eqc = `y = ${model.coeffs[2]} - ${Math.abs(model.coeffs[1])} * x + ${model.coeffs[0]} * x^2`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
        describe("for a perfect dataset fitting into a parabola with 1000 points", () => {
            let x = new Array(1000).fill().map((_, i) => i)
            let y = x.map(x => 10 * x * x - 100 * x + 13)
            let model = polynomial({ x, y, order: 2 })
            let coeffs = [10, -100, 13]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-7 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-7 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * x + a2 * x^2"
                let eqc = `y = ${model.coeffs[2]} - ${Math.abs(model.coeffs[1])} * x + ${model.coeffs[0]} * x^2`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
        describe("for a perfect dataset fitting into a cubic polynomial", () => {
            let x = new Array(10).fill().map((_, i) => i)
            let y = x.map(x => 2 * x * x * x - 1 * x * x + 3 * x + 1)
            let model = polynomial({ x, y, order: 3 })
            let coeffs = [2, -1, 3, 1]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-11 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-9 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * x + a2 * x^2 + a3 * x^3"
                let eqc = `y = ${model.coeffs[3]} + ${model.coeffs[2]} * x - ${Math.abs(model.coeffs[1])} * x^2 + ${model.coeffs[0]} * x^3`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
        describe("for a perfect dataset fitting into a grade 4 polynomial", () => {
            let x = new Array(10).fill().map((_, i) => i)
            let y = x.map(x => -1 * x * x * x * x + 2 * x * x * x - 1 * x * x + 3 * x + 2)
            let model = polynomial({ x, y, order: 4 })
            let coeffs = [-1, 2, -1, 3, 2]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-9 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-7 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * x + a2 * x^2 + a3 * x^3 + a4 * x^4"
                let eqc = `y = ${model.coeffs[4]} + ${model.coeffs[3]} * x - ${Math.abs(model.coeffs[2])} * x^2 + ${model.coeffs[1]} * x^3 - ${Math.abs(model.coeffs[0])} * x^4`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })

        describe("for a simple noisy dataset", () => {
            let x = [0, 1, 3, 4]
            let y = [0, 1, 2, 5]
            let model = polynomial({ x, y, order: 2 })
            let coeffs = [1 / 3, -7 / 30, 3 / 10]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-14 })
            })
        })

        describe("for a simple random noisy dataset", () => {
            let x = new Array(10000).fill().map((_, i) => -500 + i)
            let y = x.map(x => 10 * x * x - 100 * x + 13 + Math.random() * x * 10)
            let model = polynomial({ x, y, order: 2 })
            it("returns the regression coefficients", () => {
                assert.equal(model.coeffs.length, 3)
            })
            it("returns six error metrics", () => {
                assert.equal(Object.keys(model.metrics).length, 6)
            })
        })

    })

    describe("logarithmic()", () => {
        describe("for a perfect dataset", () => {
            let x = new Array(10).fill().map((_, i) => i + 1)
            let y = x.map(x => 13 + 8 * Math.log(x))
            let model = logarithmic({ x, y })
            let coeffs = [13, 8]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-14 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-14 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * log(x)"
                let eqc = `y = ${model.coeffs[0]} + ${model.coeffs[1]} * log(x)`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })

        })
    })

    describe("exponential()", () => {
        describe("for a perfect dataset", () => {
            let x = new Array(10).fill().map((_, i) => i / 10)
            let y = x.map(x => 13 * Math.exp(8 * x))
            let model = exponential({ x, y })
            let coeffs = [13, 8]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-13 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-10 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 * exp(a1 * x)"
                let eqc = `y = ${model.coeffs[0]} * exp(${model.coeffs[1]} * x)`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
        describe("for a perfect dataset", () => {
            let x = new Array(10).fill().map((_, i) => i / 10)
            let y = x.map(x => 13 * Math.exp(-8 * x))
            let model = exponential({ x, y })
            let coeffs = [13, -8]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-15 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-15 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 * exp(a1 * x)"
                let eqc = `y = ${model.coeffs[0]} * exp(${model.coeffs[1]} * x)`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
    })

    describe("power()", () => {
        describe("for a perfect dataset", () => {
            let x = new Array(10).fill().map((_, i) => 1 + i * 5)
            let y = x.map(x => 0.01 * Math.pow(x, 1.3))
            let model = power({ x, y })
            let coeffs = [0.01, 1.3]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-14 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y, predict: model.predict, tolerance: 1e-14 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a * x^(b)"
                let eqc = `y = ${model.coeffs[0]} * x^(${model.coeffs[1]})`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
    })

    describe("leastSquaresRegression()", () => {
        describe("for a perfect dataset following a quadratic curve", () => {
            let x = new Array(10).fill().map((_, i) => i)
            let data = x.map(v => ({ x: v, y: 2 + v * v }))
            let model = leastSquaresRegression({ type: "quadratic", data })
            let coeffs = [1, 0, 2]
            it("returns the regression coefficients", () => {
                checkCoeffs({ calcCoeffs: model.coeffs, realCoeffs: coeffs, tolerance: 1e-12 })
            })
            it("returns the predict function", () => {
                checkPredictions({ x, y: data.map(d => d.y), predict: model.predict, tolerance: 1e-12 })
            })
            it("returns the equation as a string", () => {
                let eqp = "y = a0 + a1 * x + a2 * x^2"
                let eqc = `y = ${model.coeffs[2]} + ${Math.abs(model.coeffs[1])} * x + ${model.coeffs[0]} * x^2`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
    })

})