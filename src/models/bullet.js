import {Circle} from './base'

export const Bullet = {
  of: ({x, y, radius, vector}) => ({
    _circle: Circle.of({x, y, radius}),
    x,
    y,
    radius,
    vector
  })
}
