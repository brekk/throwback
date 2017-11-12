import {pipe} from 'ramda'
import {
  FEATURE as WEAPON,
  create as createWeapon,
  updateEphemeraPre as updateEphemeraWeaponPre,
  updateEphemeraPost as updateEphemeraWeaponPost
} from './weapons'

export const FEATURES = Object.assign(
  {},
  WEAPON
)

export const create = () => {
  createWeapon()
}

export const updateEphemeraPre = pipe(
  updateEphemeraWeaponPre
)

export const updateEphemeraPost = pipe(
  updateEphemeraWeaponPost
)
