import {WORLD} from '../../world'
export function updatePre(context) {
  const {
    shots,
    hits,
    targets,
    text
  } = WORLD.stats
  console.log(context, `boundo?`)
  if (!text) {
    WORLD.stats.text = context.add.text(10, 10, `Stats:\n
      ${shots} shots\n
      ${hits} hits\n
      ${targets} targets
    `)
  }
}
