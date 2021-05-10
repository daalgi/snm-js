const { Matrix, Vector } = require("../src/linearAlgebra")
const assert = require("chai").assert

describe("linear-algebra module - Matrix object", () => {

    describe("Matrix class defines a matrix", () => {
        // Static methods
        it("Matrix.zeros(3, 2) defines a 3x2 matrix filled with zeros", () => {
            let res = new Matrix([0, 0], [0, 0], [0, 0])
            assert.deepEqual(Matrix.zeros(3, 2), res)
        })
        it("Matrix.eye(3) defines a 3x3 identity matrix", () => {
            let res = new Matrix([1, 0, 0], [0, 1, 0], [0, 0, 1])
            assert.deepEqual(Matrix.eye(3), res)
        })

        // Class methods
        describe("Matrix([1, 2, 3], [2, 1, 5], [-1, 2, -1])", () => {
            const m = new Matrix([1, 2, 3], [2, 1, 5], [-1, 2, -1])
            it(".toArray() should return a copy of the two-dimensional array 'rows'", () => {
                let arr = m.toArray()
                assert.deepEqual(arr, m.rows)
                arr[0][0] = 88
                assert.notEqual(arr[0][0], m.rows[0][0])
            })
            it(".columns() should return a two-dimensional array with the transposed matrix", () => {
                assert.deepEqual(m.columns(), [[1, 2, -1], [2, 1, 2], [3, 5, -1]])
            })
            it("should be a squared matrix", () => {
                assert.isTrue(m.isSquare())
            })
            describe(".equalSize()", () => {
                it("should return true when comparing with other 3x3 matrix", () => {
                    assert.isTrue(m.equalSize(Matrix.eye(3)))
                })
                it("should return true when comparing with other 5x5 matrix", () => {
                    assert.isFalse(m.equalSize(Matrix.eye(5)))
                })
            })
            it("added by itselft should be equal to Matrix([2, 4, 6], [4, 2, 10], [-2, 4, -2])", () => {
                let res = new Matrix([2, 4, 6], [4, 2, 10], [-2, 4, -2])
                assert.deepEqual(m.add(m), res)
            })
            it("subtracted by itselft should be equal to a matrix full of zeros", () => {
                assert.deepEqual(m.subtract(m), Matrix.zeros(m.rows_number))
            })
            it("scaled by 3 should be equal to a Matrix([3, 6, 9], [6, 3, 15], [-3, 6, -3])", () => {
                let res = new Matrix([3, 6, 9], [6, 3, 15], [-3, 6, -3])
                assert.deepEqual(m.scaleBy(3), res)
            })
            it("multiplied by itself should be equal to Matrix([2, 10, 10], [-1, 15, 6], [4, -2, 8])", () => {
                let mult = m.multiply(m)
                let res = new Matrix([2, 10, 10], [-1, 15, 6], [4, -2, 8])
                assert.deepEqual(mult, res)
            })

            it("should have a transposed equal to Matrix([1, 2, -1], [2, 1, 2], [3, 5, -1])", () => {
                let res = new Matrix([1, 2, -1], [2, 1, 2], [3, 5, -1])
                assert.deepEqual(m.transpose(), res)
            })
            it("should have a determinant equal to -2", () => {
                assert.equal(m.determinant(), -2)
            })
            it(".submatrixRemoving(1, 1) should return a Matrix([1, 3], [-1, -1])", () => {
                let res = new Matrix([1, 3], [-1, -1])
                assert.deepEqual(m.submatrixRemoving(1, 1), res)
            })
            it(".minor(1, 1) should return the determinant of the Matrix([1, 3], [-1, -1]), which is equal to 2", () => {
                assert.equal(m.minor(1, 1), 2)
            })
            it(".cofactor(1, 1) should return +2", () => {
                assert.equal(m.cofactor(1, 1), 2)
            })
            it("should have an inverse Matrix([5.5, -4, -3.5], [1.5, -1, -0.5], [-2.5, 2, 1.5])", () => {
                let inv = m.inverse()
                let res = new Matrix([5.5, -4, -3.5], [1.5, -1, -0.5], [-2.5, 2, 1.5])
                for (let i = 0; i < m.rows_number; i++) {
                    for (let j = 0; j < m.columns_number; j++) {
                        assert.closeTo(inv.rows[i][j], res.rows[i][j], 1e-15)
                    }
                }
            })
            it("with y = Vector(8, -3, 13), the solution of the system M x = y should be Vector(10.5, 8.5, -6.5)", () => {
                let y = new Vector(8, -3, 13)
                let x = m.solve(y)
                let res = new Vector(10.5, 8.5, -6.5)
                for (let i = 0; i < x.components.length; i++) {
                    assert.closeTo(x.components[i], res.components[i], 1e-14)
                }
            })

        })

    })

})