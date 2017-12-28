import {WORLD} from '../../world'

export const create = () => {
  // console.debug(`creating stats!`)
  WORLD.stats = {
    shots: 0,
    hits: 0,
    targets: 0,
    graphics: {}
  }
}
