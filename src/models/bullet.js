import {Circle} from './base'

export const Bullet = {
  of: ({x, y, radius, vector}) => ({
    _circle: Circle.of({x, y, radius}),
    // ^ Todo: This should become a computed property so we don't have to update it when everything else updates.
    x,
    y,
    radius,
    vector
  })
}
