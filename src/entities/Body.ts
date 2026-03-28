import { PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import type { Vect } from '../engine/Vect'

export class Body extends Entity {
  radius = 10
  pos: Vect

  constructor(pos: Vect, radius = 10) {
    super()
    this.pos = pos
    this.radius = radius
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white'

    for (let row = -this.radius; row <= this.radius; row++) {
      for (let col = -this.radius; col <= this.radius; col++) {
        if (col * col + row * row <= this.radius * this.radius) {
          ctx.fillRect(this.pos.x + col * PIXEL, this.pos.y + row * PIXEL, PIXEL, PIXEL)
        }
      }
    }
  }
}
