const { areEqual, sum, rnd } = require("./utils");


class Vector {
    constructor(...components) {
        if (!components.every(elem => Number.isFinite(elem)))
            throw new Error("All the components in the vector should be numbers.")
        this.components = components;
    }

    toArray() {
        return [...this.components];
    }
    add({ components }) {
        return new Vector(
            ...components.map((component, index) => this.components[index] + component)
        );
    }

    subtract({ components }) {
        return new Vector(
            ...components.map((component, index) => this.components[index] - component)
        );
    }

    scaleBy(number) {
        return new Vector(
            ...this.components.map(component => component * number)
        );
    }

    length() {
        return Math.hypot(...this.components);
    }

    dotProduct({ components }) {
        return components.reduce((acc, component, index) => acc + this.components[index] * component, 0);
    }

    normalize() {
        return this.scaleBy(1 / this.length());
    }

    normalizedDotProduct(other) {
        return this.normalize().dotProduct(other.normalize());
    }

    hasSameDirection(other) {
        return areEqual(this.normalizedDotProduct(other), 1);
    }

    hasOppositeDirection(other) {
        return areEqual(this.normalizedDotProduct(other), -1);
    }

    isPerpendicular(other) {
        return areEqual(this.normalizedDotProduct(other), 0);
    }

    angleBetween(other) {
        return toDegrees(
            Math.acos(
                this.dotProduct(other) /
                (this.length() * other.length())
            )
        );
    }

    projectOn(other) {
        const normalized = other.normalize()
        return normalized.scaleBy(this.dotProduct(normalized));
    }

    withLength(newLength) {
        return this.normalize().scaleBy(newLength);
    }

    equalTo({ components }) {
        return components.every((component, index) => areEqual(component, this.components[index]));
    }

    transform(matrix) {
        if (!matrix.rows.every((column, i, columns) => column.length === columns[0].length)) {
            throw new Error("Matrix columns length should be equal to vector components length.");
        }
        return new Vector(...matrix.rows.map((row, i) => row.reduce((acc, col, j) => acc + col * this.components[j], 0)));
    }
}


class Matrix {
    constructor(...rows) {
        if (!rows.every(col => col.length === rows[0].length))
            throw new Error("All the rows should have the same number of columns.");
        if (!rows.every(col => col.every(elem => Number.isFinite(elem))))
            throw new Error("All the elements in the matrix should be numbers.")

        this.rows_number = rows.length;
        this.columns_number = rows[0].length;
        this.rows = rows;
    }

    // Matrix filled with zeros
    static zeros(rows, cols = undefined) {
        if (typeof cols === "undefined")
            cols = rows;
        return new Matrix(...new Array(rows).fill(0).map(row => new Array(cols).fill(0)));
    }

    // Identity matrix
    static eye(n) {
        return new Matrix(...new Array(n).fill(0).map((row, i) =>
            new Array(n).fill(0).map((col, j) =>
                i === j ? 1 : 0)));
    }

    // Matrix filled with random numbers
    static random({ rows, cols = undefined, min = 0, max = 1 }) {
        if (typeof cols === "undefined")
            cols = rows;
        return new Matrix(...new Array(rows).fill(0).map(row =>
            new Array(cols).fill(0).map(_ => rnd(min, max))));
    }

    // Copy of the rows
    toArray() {
        return this.rows.map(r => r.map(c => c));
    }

    columns() {
        return this.rows[0].map((_, i) => this.rows.map(r => r[i]));
    }

    isSquare() {
        return this.rows_number === this.columns_number;
    }

    equalSize(other) {
        return this.rows_number === other.rows_number && this.columns_number === other.columns_number;
    }

    checkEqualSize(other) {
        if (!this.equalSize(other))
            throw new Error("Both matrices should have the same size.")
    }

    add(other) {
        this.checkEqualSize(other);
        return new Matrix(...this.rows.map((row, i) => row.map((elem, j) => elem + other.rows[i][j])));
    }

    subtract(other) {
        this.checkEqualSize(other);
        return new Matrix(...this.rows.map((row, i) => row.map((elem, j) => elem - other.rows[i][j])));
    }

    scaleBy(factor) {
        return new Matrix(...this.rows.map(row => row.map(elem => elem * factor)));
    }

    multiply(other) {
        if (this.columns_number !== other.rows_number)
            throw new Error("The number of columns of the first matrix should be equal to the number of rows of the second.");

        let result = [];
        for (let i = 0; i < this.rows_number; i++) {
            result[i] = [];
            for (let j = 0; j < other.columns_number; j++) {
                result[i][j] = 0;
                for (let k = 0; k < other.rows_number; k++) {
                    result[i][j] += this.rows[i][k] * other.rows[k][j];
                }
            }
        }
        return new Matrix(...result);
    }

    transpose() {
        return new Matrix(...this.columns());
    }

    determinant() {
        if (this.rows_number !== this.columns_number)
            throw new Error("The number of rows is not equal to the number of columns. The determinant can't be computed.")

        if (this.rows_number == 1)
            return this.rows[0][0];

        if (this.rows_number == 2)
            return this.rows[0][0] * this.rows[1][1] - this.rows[0][1] * this.rows[1][0];

        const subMatricesDeterminant = this.rows[0].map((coef, index) => {
            const subMatrixRows = this.rows.slice(1).map(row => [...row.slice(0, index), ...row.slice(index + 1)]);
            const subMatrix = new Matrix(...subMatrixRows);
            const res = coef * subMatrix.determinant();
            return index % 2 === 0 ? res : -res;
        })
        return sum(subMatricesDeterminant);
    }

    submatrixRemoving(row, column) {
        return new Matrix(...this.rows.filter((_, i) => i != row).map(row => row.filter((_, j) => j != column)));
    }

    map(func) {
        return new Matrix(
            ...this.rows.map((row, i) => row.map((element, j) => func(element, i, j)))
        )
    }

    /*
    (i,j) minor is the determinant of the submatrix formed 
    by deleting the i-th row and j-th column
    */
    minor(i, j) {
        return this.submatrixRemoving(i, j).determinant();
    }

    cofactor(i, j) {
        const sign = Math.pow(-1, i + j);
        return sign * this.minor(i, j);
    }

    /*
    The adjugate of a square matrix is the transpose of its cofactor matrix
    */
    adjugate() {
        if (this.rows_number !== this.columns_number)
            throw new Error("The number of rows is not equal to the number of columns. The adjugate can't be computed.")

        return this.map((_, i, j) => this.cofactor(i, j)).transpose();
    }

    // Inverse matrix using the Gaussian elimination method
    inverse() {
        if (this.rows_number !== this.columns_number)
            throw new Error("The number of rows is not equal to the number of columns. The inverse can't be computed.")

        let I = Matrix.eye(this.rows_number).toArray();
        let C = this.toArray();
        var i = 0, ii = 0, j = 0, dim = this.rows_number, e = 0, t = 0;
        // Perform elementary row operations
        for (i = 0; i < dim; i += 1) {
            // get the element e on the diagonal
            e = C[i][i];

            // if we have a 0 on the diagonal (we'll need to swap with a lower row)
            if (e == 0) {
                //look through every row below the i'th row
                for (ii = i + 1; ii < dim; ii += 1) {
                    //if the ii'th row has a non-0 in the i'th col
                    if (C[ii][i] != 0) {
                        //it would make the diagonal have a non-0 so swap it
                        for (j = 0; j < dim; j++) {
                            e = C[i][j];       //temp store i'th row
                            C[i][j] = C[ii][j];//replace i'th row by ii'th
                            C[ii][j] = e;      //repace ii'th by temp
                            e = I[i][j];       //temp store i'th row
                            I[i][j] = I[ii][j];//replace i'th row by ii'th
                            I[ii][j] = e;      //repace ii'th by temp
                        }
                        //don't bother checking other rows since we've swapped
                        break;
                    }
                }
                //get the new diagonal
                e = C[i][i];
                //if it's still 0, not invertable (error)
                if (e == 0) { return }
            }

            // Scale this row down by e (so we have a 1 on the diagonal)
            for (j = 0; j < dim; j++) {
                C[i][j] = C[i][j] / e; //apply to original matrix
                I[i][j] = I[i][j] / e; //apply to identity
            }

            // Subtract this row (scaled appropriately for each row) from ALL of
            // the other rows so that there will be 0's in this column in the
            // rows above and below this one
            for (ii = 0; ii < dim; ii++) {
                // Only apply to other rows (we want a 1 on the diagonal)
                if (ii == i) { continue; }

                // We want to change this element to 0
                e = C[ii][i];

                // Subtract (the row above(or below) scaled by e) from (the
                // current row) but start at the i'th column and assume all the
                // stuff left of diagonal is 0 (which it should be if we made this
                // algorithm correctly)
                for (j = 0; j < dim; j++) {
                    C[ii][j] -= e * C[i][j]; //apply to original matrix
                    I[ii][j] -= e * I[i][j]; //apply to identity
                }
            }
        }

        //we've done all operations, C should be the identity
        //matrix I should be the inverse:
        return new Matrix(...I);

    }

    /*  Inverse matrix using the Cramer's rule
        (too slow)    
    
    _inverseCramer() {
        const det = this.determinant();
        if(areEqual(det, 0))
            throw new Error("The determinant is zero, so the matrix is not invertible.")
        
        const adjugate = this.adjugate();
        return adjugate.scaleBy(1 / det);
    }*/

    solve(b) {
        if (!b instanceof Vector)
            throw new Error("b should be an instance of the class Vector");
        return b.transform(this.inverse());
    }
}

module.exports = {
    Matrix,
    Vector
}