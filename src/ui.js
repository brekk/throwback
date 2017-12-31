import {WORLD} from './world'

export const updateScoreText = () => {
  WORLD.ui.scoreText.setText([
    `Score: ${WORLD.score}`,
    `Wave: ${WORLD.ephemera.wave}`
  ])
}

export const showGameOver = () => {
  WORLD.ui.gameOverText.setText([
    `Game Over!`
  ])
}
