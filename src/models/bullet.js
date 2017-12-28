import {Circle} from './base'

const _bullet = ({x, y, radius, vector, speed}) => ({
  _circle: Circle.of({x, y, radius}),
  // ^ Todo: This should become a computed property so
  //         we don't have to update it when everything else updates.
  x,
  y,
  radius,
  speed,
  vector
})

export const Bullet = {
  of: _bullet
}
