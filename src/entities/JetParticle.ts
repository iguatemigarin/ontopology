import { COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import type { Vect } from '../engine/Vect'

export class JetParticle extends Entity {
  p: Vect
  v: Vect
  r: number
  color: string
  alpha = 1
  burn = 0.0005

  constructor(p: Vect, v: Vect, r: number) {
    super()
    this.p = { ...p }
    this.r = r

    this.v = {
      x: v.x + (0.5 - Math.random()) * 0.01,
      y: v.y + (0.5 - Math.random()) * 0.01,
    }
    this.color = Math.random() > 0.5 ? COLOR.RED : COLOR.YELLOW
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.p.x, this.p.y)
    ctx.rotate(this.r)
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.fillStyle = this.color
    ctx.fillRect(-PIXEL / 2, -PIXEL / 2, PIXEL, PIXEL)
    ctx.restore()
  }

  update(delta: number) {
    this.p.x += this.v.x * delta
    this.p.y += this.v.y * delta
    this.alpha -= this.burn * delta
    if (this.alpha <= 0) {
      this.destroy()
    }
  }
}
