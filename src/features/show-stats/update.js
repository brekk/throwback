import {WORLD} from '../../world'
export function updatePre(add) {
  const {
    shots,
    hits,
    targets,
    text
  } = WORLD.stats
  // console.log(add, `boundo?`)
  if (!text) {
    WORLD.stats.text = add(
      10,
      10,
      `Stats: ${shots} shots ${hits} hits ${targets} targets`
    )
    // WORLD.stats.text.name = `butts`
    // console.log(`>>>`, WORLD.stats.text)
  }
}
