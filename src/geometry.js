function randomPointInBox({boundingBox=[[0, 0], [1, 1]]}){
    let point = []
    for(let comp = 0; comp < boundingBox[0].length; comp++){
        point.push(Math.random()*(boundingBox[1][comp]-boundingBox[0][comp])+boundingBox[0][comp])
    }
    return point
}

// Bounding Box of an array of Bounding Boxes
function boundingBoxAddition(boxes){
    let res = []
    res[0] = []
    res[1] = []
    for(let comp = 0; comp < boxes[0].length; comp++){
        res[0][comp] = Math.min(...boxes.map((_, i) => boxes[i][0][comp]))
        res[1][comp] = Math.max(...boxes.map((_, i) => boxes[i][1][comp]))
    }
    return res
}

// Area of a 2D Bounding Box
function boundingBoxArea(box){
    return (box[1][0]-box[0][0]) * (box[1][1]-box[0][1])
}

// Volume of a 3D Bounding Box
function boundingBoxVolume(box){
    return (box[1][0]-box[0][0]) * (box[1][1]-box[0][1]) * (box[1][2]-box[0][2])
}


class Rectangle {
    constructor({ center=[0, 0], width=1, height=1 }){
        this.center = center
        this.width = width
        this.height = height
        this.boundingBox = [
            [center[0]-width/2, center[1]-height/2],
            [center[0]+width/2, center[1]+height/2]]
    }
    isInside(point){
        return (
            point[0] >= this.boundingBox[0][0] &&
            point[0] <= this.boundingBox[1][0] &&
            point[1] >= this.boundingBox[0][1] &&
            point[1] <= this.boundingBox[1][1]
        )
    }
}

class Circle {
    constructor({ center=[0, 0], radius=1 }){
        this.center = center
        this.radius = radius
        this.boundingBox = [
            [center[0]-radius, center[1]-radius],
            [center[0]+radius, center[1]+radius]]
    }    
    isInside(point){
        return (point.reduce((acc, p, i) => acc+Math.pow(p-this.center[i], 2), 0)) < Math.pow(this.radius, 2)
    }
}

class RectangularPrism {
    constructor({ center=[0, 0, 0], width=1, height=1, depth=1 }){
        this.center = center
        this.width = width
        this.height = height
        this.depth = depth
        this.boundingBox = [
            [center[0]-width/2, center[1]-height/2, center[2]-depth/2],
            [center[0]+width/2, center[1]+height/2, center[2]+depth/2]
        ]
    }
    isInside(point){
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
    constructor({ center=[0, 0, 0], radius=1 }){
        this.center = center
        this.radius = radius
        this.boundingBox = [
            [center[0]-radius, center[1]-radius, center[2]-radius],
            [center[0]+radius, center[1]+radius, center[2]+radius]
        ]
    }
    isInside(point){
        return (point.reduce((acc, p, i) => acc+Math.pow(p-this.center[i], 2), 0)) < Math.pow(this.radius, 2)
    }
}

class Cone {
    constructor({ center=[0, 0, 0], vertex=[0, 0, 1], radius=1 }){
        this.center = center
        this.vertex = vertex
        this.radius = radius
        this.boundingBox = []
    }
    isInside(point){

    }
}

module.exports = { 
    randomPointInBox, 
    boundingBoxAddition, boundingBoxArea, boundingBoxVolume,
    Rectangle, Circle, RectangularPrism, Sphere, Cone }