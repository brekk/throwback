import {pipe} from 'ramda'
// import {WORLD} from '../world'
import {
  FEATURE as SHOW_STATS,
  create as createStats,
  updatePre as updateStatsPre
} from './show-stats'
import {
  FEATURE as WEAPON,
  create as createWeapon,
  updateEphemeraPre as updateEphemeraWeaponPre,
  updateEphemeraPost as updateEphemeraWeaponPost
} from './weapons'

export const FEATURES = Object.assign(
  {},
  WEAPON,
  SHOW_STATS
)

export const create = () => {
  // console.debug(`running create hook!`)
  createWeapon()
  createStats()
}
export function updatePre(context) {
  updateStatsPre(context)
}

export const updateEphemeraPre = pipe(
  updateEphemeraWeaponPre
)

export const updateEphemeraPost = pipe(
  updateEphemeraWeaponPost
)
