import {CONFIG} from '../config'
import {WORLD} from '../world'
import {applyVector} from '../util'
import {Circle} from './base'

const {colors} = CONFIG
const {yellow, white} = colors

const _bullet = ({x, y, radius, vector, speed, owner}) => {
  let _x = x
  let _y = y
  let _radius = radius
  let _vector = vector
  let _speed = speed
  let _owner = owner

  const properties = {
    position: () => ({x: _x, y: _y}),
    radius: () => _radius,
    vector: () => _vector,
    speed: () => _speed,
    owner: () => _owner
  }
  const draw = () => {
    WORLD.graphics.lineStyle(2, yellow, 2)
    WORLD.graphics.fillStyle(WORLD.wiggleShot ? white : yellow, 1)
    WORLD.graphics.fillCircle(_x, _y, properties.radius())
  }
  const update = () => {
    const {x: newX, y: newY} = applyVector({x: _x, y: _y}, _vector, _speed)
    _x = newX
    _y = newY
  }

  return {
    _engine: {
      _circle: () => Circle.of({x: _x, y: _y, radius: _radius})
    },
    properties,
    draw,
    update
  }
}

export const Bullet = {
  of: _bullet
}
