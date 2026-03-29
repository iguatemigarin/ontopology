import { COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import type { Vect } from '../engine/Vect'

export class Body extends Entity {
  radius = 10
  p: Vect
  m: number

  constructor(p: Vect, m: number, radius = 10) {
    super()
    this.p = p
    this.m = m
    this.radius = radius * PIXEL
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = COLOR.WHITE

    for (let row = -this.radius; row <= this.radius; row++) {
      for (let col = -this.radius; col <= this.radius; col++) {
        if (col * col + row * row <= this.radius * this.radius) {
          ctx.fillRect(this.p.x + col * PIXEL, this.p.y + row * PIXEL, PIXEL + 1, PIXEL + 1)
        }
      }
    }
  }
}
