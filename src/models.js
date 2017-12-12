import Phaser from 'phaser'

const {Geom} = Phaser
const {Circle: PCircle} = Geom
// abstract over the original code we wrote and using proper PhaserCircles
export const Circle = {
  of: ({x, y, a, _radius}) => new PCircle(x, y, _radius || a)
}

export const Bullet = {
  of: ({x, y, radius, vector}) => ({
    _circle: Circle.of(x, y, radius),
    x,
    y,
    radius,
    vector
  })
}
