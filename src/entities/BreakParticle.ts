import { COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import type { Vect } from '../engine/Vect'

export class BreakParticle extends Entity {
  p: Vect
  v: Vect
  r: number
  rRate: number
  color: string
  alpha = 1
  burn = 0.001

  constructor(p: Vect, v: Vect) {
    super()
    this.p = { ...p }
    this.r = Math.random()
    this.rRate = Math.random() > 0.5 ? -0.01 : 0.01
    this.v = {
      x: v.x + (0.5 - Math.random()) * 0.05,
      y: v.y + (0.5 - Math.random()) * 0.05,
    }
    this.color = Math.random() > 0.5 ? COLOR.GREY2 : COLOR.GREY5
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.p.x, this.p.y)
    ctx.rotate(this.r * Math.PI)
    ctx.globalAlpha = Math.max(0, this.alpha)
    ctx.fillStyle = this.color
    ctx.fillRect(-PIXEL / 2, -PIXEL / 2, PIXEL, PIXEL)
    ctx.restore()
  }

  update(delta: number) {
    this.p.x += this.v.x * delta
    this.p.y += this.v.y * delta
    this.alpha -= this.burn * delta
    this.r += this.rRate
    if (this.alpha <= 0) {
      this.destroy()
    }
  }
}
