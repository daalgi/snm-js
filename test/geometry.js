const {
    findLineXaxisIntersection,
    Point2d, Line2d
} = require("../src/geometry")
const assert = require("chai").assert


describe("geometry module", () => {

    describe("findLineXaxisIntersection(): returns the x-coordinate of the intersection between a given line and the x-axis", () => {
        it("Line (-1, -1), (1, 1) returns the expected intersection", () => {
            assert.equal(findLineXaxisIntersection({ x1: -1, y1: -1, x2: 1, y2: 1 }), 0)
        })

        it("Line (-1, 2), (1, 2) throws a line parallel to x-axis error", () => {
            assert.throws(() => { findLineXaxisIntersection({ x1: -1, y1: 2, x2: 1, y2: 2 }) },
                Error, "The line is parallel to the X-axis")
        })
    })

    describe("object Point2d", () => {
        const p = new Point2d({ x: 1, y: 2 })

        it("represents a point by means of two coordinates", () => {            
            assert.equal(p.x, 1)
            assert.equal(p.y, 2)
        })

        it("distanceToPoint(point)", () => {
            const p1 = new Point2d({ x: 1, y: 3 })
            assert.equal(p.distanceToPoint(p1), 1)
        })

        it("vectorTo(point)", () => {
            const p1 = new Point2d({ x: 2, y: 4 })
            assert.deepEqual(p.vectorTo(p1), [1, 2])
        })

        it("unitVectorTo(point)", () => {
            const p1 = new Point2d({ x: 10, y: 2 })
            assert.deepEqual(p.unitVectorTo(p1), [1, 0])
        })
    })

    describe("object Line2d", () => {
        const p0 = new Point2d({ x: 0, y: 1 })
        const p1 = new Point2d({ x: 1, y: 2 })
        const line = new Line2d({ p0, p1 })
        const line2 = new Line2d({ slope: 0.5, intercept: 2 })

        const p3 = new Point2d({ x: 8, y: 1 })
        const p4 = new Point2d({ x: 8, y: 2 })
        const vert = new Line2d({ p0: p3, p1:p4 })

        const horiz = new Line2d({ slope: 0, intercept: 3 })
        
        it("initialized by means of two points", () => {            
            assert.equal(line.slope, 1)
            assert.equal(line.intercept, 1)
            assert.deepEqual(line.direction, [1/Math.sqrt(2), 1/Math.sqrt(2)])
        })
        
        it("initializes an horizontal line (slope=0)", () => {
            assert.instanceOf(horiz, Line2d)
            assert.equal(horiz.slope, 0)
            assert.equal(horiz.intercept, 3)
            assert.deepEqual(horiz.direction, [1, 0])
        })

        it("initializes a vertical line (slope=Infinity)", () => {
            assert.instanceOf(vert, Line2d)
            assert.equal(vert.slope, Infinity)
            assert.equal(vert.intercept, undefined)
            assert.deepEqual(vert.direction, [0, 1])
        })

        it("initialized by means of slope and intercept", () => {            
            assert.equal(line2.slope, 0.5)
            assert.equal(line2.intercept, 2)
            assert.deepEqual(line2.direction, [1/Math.sqrt(1.25), 0.5/Math.sqrt(1.25)])
        })
        
        it("y(x) for vertical lines throws errors", () => {
            assert.throws(() => { vert.y(8) },
                Error, "Vertical line having infinite y values for x=8")
            assert.throws(() => { vert.y(0) },
                Error, "Vertical line not passing through x=0")
        })

        it("y(x) for valid cases returns the y coordinate of the line for a given x", () => {
            assert.equal(line.y(0), 1)
            assert.equal(line.y(1), 2)
            assert.equal(line.y(7), 8)

            assert.equal(line2.y(0), 2)
            assert.equal(line2.y(-1), 1.5)
            assert.equal(line2.y(-10), -3)

            assert.equal(horiz.y(0), 3)
            assert.equal(horiz.y(8), 3)
        })

        it("parallelLinePassingThrough(point)", () => {
            const p5 = new Point2d({ x: 0, y: 3 })
            const line3 = line.parallelLinePassingThrough(p5)
            assert.equal(line3.slope, 1)
            assert.equal(line3.intercept, 3)
            assert.deepEqual(line3.direction, [1/Math.sqrt(2), 1/Math.sqrt(2)])
        })
        
        it("intersection(line) returns null if the lines are parallel", () => {
            const line3 = new Line2d({ slope: 0.5, intercept: 8 })
            assert.isNull(line2.intersection(line3))
        })

        it("intersection(line) returns a Line2d if the lines are coincident", () => {
            const line3 = new Line2d({ slope: 0.5, intercept: 2 })
            const res = line2.intersection(line3)
            assert.instanceOf(res, Line2d)
            assert.equal(res.slope, 0.5)
            assert.equal(res.intercept, 2)
            assert.deepEqual(res.direction, [1/Math.sqrt(1.25), 0.5/Math.sqrt(1.25)])
        })
        
        it("intersection(line) returns a Point2d with the intersection point", () => {
            const line3 = new Line2d({ slope: -0.25, intercept: 5 })
            const res = line2.intersection(line3)
            assert.instanceOf(res, Point2d)
            assert.deepEqual(res.x, 4)
            assert.deepEqual(res.y, 4)
        })
    })

})


