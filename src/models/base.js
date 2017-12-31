import Phaser from 'phaser'

const {Geom} = Phaser
const {Circle: PCircle, Triangle: PTriangle} = Geom

// abstract over the original code we wrote and using proper PhaserCircles
export const Circle = {
  of: ({x, y, a, _radius}) => new PCircle(x, y, _radius || a)
}

export const Triangle = {
  equilateral: ({x, y, length}) => {
    const height = length * (Math.sqrt(3) / 2)
    const x1 = x
    const y1 = y
    const x2 = x + length / 2
    const y2 = y + height
    const x3 = x - length / 2
    const y3 = y2
    return new PTriangle(x1, y1, x2, y2, x3, y3)
  }
}
