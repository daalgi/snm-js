function randomPointInBox({ boundingBox = [[0, 0], [1, 1]] }) {
    let point = []
    for (let comp = 0; comp < boundingBox[0].length; comp++) {
        point.push(Math.random() * (boundingBox[1][comp] - boundingBox[0][comp]) + boundingBox[0][comp])
    }
    return point
}

// Bounding Box of an array of Bounding Boxes
function boundingBoxAddition(boxes) {
    let res = []
    res[0] = []
    res[1] = []
    for (let comp = 0; comp < boxes[0].length; comp++) {
        res[0][comp] = Math.min(...boxes.map((_, i) => boxes[i][0][comp]))
        res[1][comp] = Math.max(...boxes.map((_, i) => boxes[i][1][comp]))
    }
    return res
}

// Area of a 2D Bounding Box
function boundingBoxArea(box) {
    return (box[1][0] - box[0][0]) * (box[1][1] - box[0][1])
}

// Volume of a 3D Bounding Box
function boundingBoxVolume(box) {
    return (box[1][0] - box[0][0]) * (box[1][1] - box[0][1]) * (box[1][2] - box[0][2])
}

/**
 * Given a line defined by two points (x1, y1) and (x2, y2), 
 * compute the its intersection with the x-axis
 * @param {number} x1 x-coordinate of the point 1
 * @param {number} y1 y-coordinate of the point 1
 * @param {number} x2 x-coordinate of the point 2
 * @param {number} y2 y-coordinate of the point 2  
 * @returns {number} x-coordinate of the intersection of the line with the x-axis
 */
function findLineXaxisIntersection({ x1, y1, x2, y2 }) {
    if (y1 - y2 === 0) throw new Error("The line is parallel to the X-axis")
    return x1 - (x2 - x1) / (y2 - y1) * y1
}

class Rectangle {
    constructor({ center = [0, 0], width = 1, height = 1 }) {
        this.center = center
        this.width = width
        this.height = height
        this.boundingBox = [
            [center[0] - width / 2, center[1] - height / 2],
            [center[0] + width / 2, center[1] + height / 2]]
    }
    isInside(point) {
        return (
            point[0] >= this.boundingBox[0][0] &&
            point[0] <= this.boundingBox[1][0] &&
            point[1] >= this.boundingBox[0][1] &&
            point[1] <= this.boundingBox[1][1]
        )
    }
}

class Circle {
    constructor({ center = [0, 0], radius = 1 }) {
        this.center = center
        this.radius = radius
        this.boundingBox = [
            [center[0] - radius, center[1] - radius],
            [center[0] + radius, center[1] + radius]]
    }
    isInside(point) {
        return (point.reduce((acc, p, i) => acc + Math.pow(p - this.center[i], 2), 0)) < Math.pow(this.radius, 2)
    }
}

class RectangularPrism {
    constructor({ center = [0, 0, 0], width = 1, height = 1, depth = 1 }) {
        this.center = center
        this.width = width
        this.height = height
        this.depth = depth
        this.boundingBox = [
            [center[0] - width / 2, center[1] - height / 2, center[2] - depth / 2],
            [center[0] + width / 2, center[1] + height / 2, center[2] + depth / 2]
        ]
    }
    isInside(point) {
        return (
            point[0] >= this.boundingBox[0][0] &&
            point[0] <= this.boundingBox[1][0] &&
            point[1] >= this.boundingBox[0][1] &&
            point[1] <= this.boundingBox[1][1] &&
            point[2] >= this.boundingBox[0][2] &&
            point[2] <= this.boundingBox[1][2]
        )
    }
}

class Sphere {
    constructor({ center = [0, 0, 0], radius = 1 }) {
        this.center = center
        this.radius = radius
        this.boundingBox = [
            [center[0] - radius, center[1] - radius, center[2] - radius],
            [center[0] + radius, center[1] + radius, center[2] + radius]
        ]
    }
    isInside(point) {
        return (point.reduce((acc, p, i) => acc + Math.pow(p - this.center[i], 2), 0)) < Math.pow(this.radius, 2)
    }
}

class Cone {
    constructor({ center = [0, 0, 0], vertex = [0, 0, 1], radius = 1 }) {
        this.center = center
        this.vertex = vertex
        this.radius = radius
        this.boundingBox = []
    }
    isInside(point) {

    }
}

class Point2d {
    constructor({ x, y }) {
        this.x = x
        this.y = y
    }

    distanceToPoint(other) {
        return Math.hypot(this.x - other.x, this.y - other.y)
    }

    vectorTo(point) {
        return [point.x - this.x, point.y - this.y]
    }

    unitVectorTo(point) {
        const v = this.vectorTo(point)
        const mod = Math.hypot(...v)
        return v.map(i => i / mod)
    }
}

class Line2d {
    constructor({ p0 = null, p1 = null, slope = null, intercept = null }) {
        if (p0 !== null && p1 != null) {
            const incX = p1.x - p0.x
            if (incX === 0) {
                this.slope = Infinity
                this.intercept = undefined
                this.x0 = p0.x
                this.direction = [0, p1.y - p0.y]
            } else {
                this.slope = (p1.y - p0.y) / incX
                this.intercept = p0.y - this.slope * p0.x
                this.direction = p0.unitVectorTo(p1)
            }

        } else if (slope !== null && intercept !== null) {
            this.slope = slope
            this.intercept = intercept
            const p0 = new Point2d({ x: 0, y: intercept })
            const p1 = new Point2d({ x: 1, y: this.y(1) })
            this.direction = p0.unitVectorTo(p1)
        } else {
            throw new Error("Incorrect Line2d initialization arguments")
        }
    }

    y(x) {
        if (this.slope === Infinity) {
            if (this.x0 === x) {
                throw new Error(`Vertical line having infinite y values for x=${x}`)
            }
            throw new Error(`Vertical line not passing through x=${x}`)
        }
        return this.slope * x + this.intercept
    }

    parallelLinePassingThrough(point) {
        const intercept = point.y - this.slope * point.x
        return new Line2d({ slope: this.slope, intercept })
    }

    intersection(line) {
        if (line.slope === this.slope) {
            if (line.intercept === this.intercept) {
                return new Line2d({ slope: this.slope, intercept: this.intercept })
            }
            return null
        }
        const x = (line.intercept - this.intercept) / (this.slope - line.slope)
        const y = this.slope * x + this.intercept
        return new Point2d({ x, y })
    }
}

module.exports = {
    randomPointInBox,
    boundingBoxAddition,
    boundingBoxArea, 
    boundingBoxVolume,
    findLineXaxisIntersection,
    Rectangle, 
    Circle, 
    RectangularPrism, 
    Sphere, 
    Cone,
    Point2d, 
    Line2d
}