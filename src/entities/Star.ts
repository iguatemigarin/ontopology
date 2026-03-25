import { pixel } from '../constants'
import { Entity } from '../engine/Entity'

export class Star extends Entity {
  radius = 10
  x: number
  y: number

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white'

    for (let row = -this.radius; row <= this.radius; row++) {
      for (let col = -this.radius; col <= this.radius; col++) {
        if (col * col + row * row <= this.radius * this.radius) {
          ctx.fillRect(this.x + col * pixel, this.y + row * pixel, pixel, pixel)
        }
      }
    }
  }
}
