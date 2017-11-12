import Phaser from 'phaser'
import throttle from 'lodash/fp/throttle'
import {CONFIG} from '../config'
import {WORLD} from '../world'
const {Geom} = Phaser
const {Circle} = Geom

const {bullets} = CONFIG
const {fireRate} = bullets // bullets per this as milli
export const fireBullet = throttle(fireRate, () => {
  const {player} = WORLD
  const {physics} = player
  const {body} = physics
  const b = new Circle(
    body.pos.x + body.size.x / 2,
    body.pos.y - 15,
    5
  )
  WORLD.ephemera.bullets.push(b)
  WORLD.graphics.fillCircle(b.x, b.y, b._radius)
})
