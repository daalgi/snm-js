const { areEqual, toDegrees, toRadians} = require("./utils")

class Vector {
	constructor(...components) {
		if(!components.every(elem => Number.isFinite(elem)))
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
		if(!matrix.rows.every((column, i, columns) => column.length === columns[0].length)){
			throw new Error("Matrix columns length should be equal to vector components length.");
		}
		return new Vector(...matrix.rows.map((row, i) => row.reduce((acc, col, j) => acc + col * this.components[j], 0)));
	}
}

module.exports = {
	Vector
  }