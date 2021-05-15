const {
    totalSumSquares,
    residualSumSquares,
    meanAbsoluteError,
    meanSquaredError,
    rootMeanSquaredError,
    meanAbsolutePercentageError,
    r2score,
    r2scoreAdjusted,
    polynomialEquationToString,
    polynomial, logarithmic, exponential, power, leastSquaresRegression
} = require("../src/regression")
const { roundToFixed, sum } = require("../src/utils")
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

const DECIMALS = 4

let customMetrics = ({ x, y, func, coeffs }) =>
    [{
        label: "MAE", description: "Mean absolute error",
        value: meanAbsoluteError({ x, y, func })
    }, {
        label: "R^2", description: "R^2",
        value: r2score({ x, y, func })
    }]

describe("regression module", () => {

    describe("polynomialEquationToString()", () => {
        describe("for a constant equation", () => {
            let coeffs = [8]
            it("returns the string representation of the equation with 3 decimals", () => {
                let eqp = "y = a_0"
                let eqc = "y = 8.0000"
                let eq = polynomialEquationToString({ coeffs })
                assert.equal(eq.withParameters, eqp)
                assert.equal(eq.withCoefficients, eqc)
            })
        })
        describe("for a linear equation", () => {
            let coeffs = [1, 1]
            it("returns the string representation of the equation with 3 decimals", () => {
                let eqp = "y = a_0 + a_1 * x"
                let eqc = "y = 1.000 + 1.000 x"
                let eq = polynomialEquationToString({ coeffs, coeffDecimals: 3 })
                assert.equal(eq.withParameters, eqp)
                assert.equal(eq.withCoefficients, eqc)
            })
            it("returns the string representation of the equation with 4 decimals", () => {
                let eqp = "y = a_0 + a_1 * x"
                let eqc = "y = 1.0000 + 1.0000 x"
                let eq = polynomialEquationToString({ coeffs, coeffDecimals: 4 })
                assert.equal(eq.withParameters, eqp)
                assert.equal(eq.withCoefficients, eqc)

                eq = polynomialEquationToString({ coeffs })
                assert.equal(eq.withParameters, eqp)
                assert.equal(eq.withCoefficients, eqc)
            })
        })
        describe("for a quadratic equation", () => {
            let coeffs = [8, 0, 3]
            it("returns the string representation of the equation with 3 decimals", () => {
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2"
                let eqc = "y = 3.0000 + 0.0000 x + 8.0000 x^2"
                let eq = polynomialEquationToString({ coeffs })
                assert.equal(eq.withParameters, eqp)
                assert.equal(eq.withCoefficients, eqc)
            })
        })
        describe("for a cubic equation", () => {
            let coeffs = [8, -1, -3.0, -13.13136]
            it("returns the string representation of the equation with 3 decimals", () => {
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2 + a_3 * x^3"
                let eqc = "y = -13.1314 - 3.0000 x - 1.0000 x^2 + 8.0000 x^3"
                let eq = polynomialEquationToString({ coeffs })
                assert.equal(eq.withParameters, eqp)
                assert.equal(eq.withCoefficients, eqc)
            })
        })
    })

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
                let eqp = "y = a_0 + a_1 * x"
                let eqc = `y = ${roundToFixed(model.coeffs[1], 4)}`
                eqc += ` + ${roundToFixed(model.coeffs[0], 4)} x`
                assert.equal(model.equation.withParameters, eqp)
                assert.equal(model.equation.withCoefficients, eqc)
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
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2"
                let eqc = `y = ${roundToFixed(model.coeffs[2], 4)}`
                eqc += ` + ${roundToFixed(model.coeffs[1], 4)} x`
                eqc += ` + ${roundToFixed(model.coeffs[0], 4)} x^2`
                assert.equal(model.equation.withParameters, eqp)
                assert.equal(model.equation.withCoefficients, eqc)
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
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2"
                let eqc = `y = ${roundToFixed(model.coeffs[2], 4)}`
                eqc += ` - ${roundToFixed(Math.abs(model.coeffs[1]), 4)} x`
                eqc += ` + ${roundToFixed(model.coeffs[0], 4)} x^2`
                assert.equal(model.equation.withParameters, eqp)
                assert.equal(model.equation.withCoefficients, eqc)
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
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2"
                let eqc = `y = ${roundToFixed(model.coeffs[2], 4)}`
                eqc += ` - ${roundToFixed(Math.abs(model.coeffs[1]), 4)} x`
                eqc += ` + ${roundToFixed(model.coeffs[0], 4)} x^2`
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
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2 + a_3 * x^3"
                let eqc = `y = ${roundToFixed(model.coeffs[3], 4)}`
                eqc += ` + ${roundToFixed(model.coeffs[2], 4)} x`
                eqc += ` - ${roundToFixed(Math.abs(model.coeffs[1]), 4)} x^2`
                eqc += ` + ${roundToFixed(model.coeffs[0], 4)} x^3`
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
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2 + a_3 * x^3 + a_4 * x^4"
                let eqc = `y = ${roundToFixed(model.coeffs[4], 4)}`
                eqc += ` + ${roundToFixed(model.coeffs[3], 4)} x`
                eqc += ` - ${roundToFixed(Math.abs(model.coeffs[2]), 4)} x^2`
                eqc += ` + ${roundToFixed(model.coeffs[1], 4)} x^3`
                eqc += ` - ${roundToFixed(Math.abs(model.coeffs[0]), 4)} x^4`
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

        describe("custom metrics", () => {
            let x = [0, 1, 3, 4]
            let y = [1, 2, 4, 5]
            let model = polynomial({ x, y, order: 1, customMetrics })
            it("returns custom `metrics`", () => {
                assert.equal(model.metrics.length, 2)
                assert.hasAllKeys(model.metrics[0], ["label", "description", "value"])
                assert.hasAllKeys(model.metrics[1], ["label", "description", "value"])
                assert.equal(model.metrics[0].label, "MAE")
                assert.equal(model.metrics[1].label, "R^2")
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
                let eqp = "y = a_0 + a_1 * log(x)"
                let eqc = `y = ${roundToFixed(model.coeffs[0], 4)}`
                eqc += ` + ${roundToFixed(model.coeffs[1], 4)} * log(x)`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
            describe("custom metrics", () => {
                model = logarithmic({ x, y, customMetrics })
                it("returns custom `metrics`", () => {
                    assert.equal(model.metrics.length, 2)
                    assert.hasAllKeys(model.metrics[0], ["label", "description", "value"])
                    assert.hasAllKeys(model.metrics[1], ["label", "description", "value"])
                    assert.equal(model.metrics[0].label, "MAE")
                    assert.equal(model.metrics[1].label, "R^2")
                })
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
                let eqp = "y = a_0 * exp(a_1 * x)"
                let eqc = `y = ${roundToFixed(model.coeffs[0], 4)}`
                eqc += ` * exp(${roundToFixed(model.coeffs[1], 4)} * x)`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
            describe("custom metrics", () => {
                model = exponential({ x, y, customMetrics })
                it("returns custom `metrics`", () => {
                    assert.equal(model.metrics.length, 2)
                    assert.hasAllKeys(model.metrics[0], ["label", "description", "value"])
                    assert.hasAllKeys(model.metrics[1], ["label", "description", "value"])
                    assert.equal(model.metrics[0].label, "MAE")
                    assert.equal(model.metrics[1].label, "R^2")
                })
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
                let eqp = "y = a_0 * exp(a_1 * x)"
                let eqc = `y = ${roundToFixed(model.coeffs[0], 4)}`
                eqc += ` * exp(${roundToFixed(model.coeffs[1], 4)} * x)`
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
                let eqc = `y = ${roundToFixed(model.coeffs[0], 4)}`
                eqc += ` * x^(${roundToFixed(model.coeffs[1], 4)})`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
            describe("custom metrics", () => {
                model = power({ x, y, customMetrics })
                it("returns custom `metrics`", () => {
                    assert.equal(model.metrics.length, 2)
                    assert.hasAllKeys(model.metrics[0], ["label", "description", "value"])
                    assert.hasAllKeys(model.metrics[1], ["label", "description", "value"])
                    assert.equal(model.metrics[0].label, "MAE")
                    assert.equal(model.metrics[1].label, "R^2")
                })
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
                let eqp = "y = a_0 + a_1 * x + a_2 * x^2"
                let eqc = `y = ${roundToFixed(model.coeffs[2], 4)}`
                eqc += ` + ${roundToFixed(Math.abs(model.coeffs[1]), 4)} x`
                eqc += ` + ${roundToFixed(model.coeffs[0], 4)} x^2`
                assert.equal(eqp, model.equation.withParameters)
                assert.equal(eqc, model.equation.withCoefficients)
            })
        })
    })

})