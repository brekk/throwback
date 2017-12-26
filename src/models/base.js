import Phaser from 'phaser'

const {Geom} = Phaser
const {Circle: PCircle, Triangle: PTriangle} = Geom

// abstract over the original code we wrote and using proper PhaserCircles
export const Circle = {
  of: ({x, y, a, _radius}) => new PCircle(x, y, _radius || a)
}

export const Triangle = {
  equilateral: (x, y, length) => {
    const height = length * (Math.sqrt(3) / 2)
    return new PTriangle(x, y, x + length / 2, y + height, x - length / 2, y + height)
  }
}
