import { COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import { isDown } from '../engine/input'
import type { Vect } from '../engine/Vect'
import { JetParticle } from './JetParticle'

export class Rocket extends Entity {
  p: Vect
  v: Vect = { x: 0, y: 0 }
  a: Vect = { x: 0, y: 0 }
  enginePower: number = 0.0001
  breakPower: number = 0.001
  rotationPower: number = 0.001
  rotation: number = 0

  width: number = 4
  height: number = 10

  constructor(pos: Vect) {
    super()
    this.p = pos
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.p.x, this.p.y)
    ctx.rotate(this.rotation)
    ctx.fillStyle = COLOR.GREY3
    ctx.fillRect(
      (-this.width / 2) * PIXEL,
      (-this.height / 2) * PIXEL,
      this.width * PIXEL,
      this.height * PIXEL,
    )
    ctx.fillStyle = COLOR.GREEN
    ctx.fillRect(
      (-this.width / 4) * PIXEL,
      (-this.height / 2) * PIXEL,
      (this.width / 2) * PIXEL,
      (this.height / 4) * PIXEL,
    )

    ctx.restore()
  }

  update(delta: number) {
    this.a = { x: 0, y: 0 }

    if (isDown('a') || isDown('ArrowLeft')) this.rotation += -this.rotationPower * delta
    if (isDown('d') || isDown('ArrowRight')) this.rotation += this.rotationPower * delta

    if (Math.abs(this.rotation) > Math.PI * 2) this.rotation = 0

    if (isDown('w') || isDown('ArrowUp')) {
      this.a.x += Math.sin(this.rotation) * this.enginePower
      this.a.y += -Math.cos(this.rotation) * this.enginePower

      this.ejectParticle()
    }
    if (isDown('s') || isDown('ArrowDown')) {
      this.a.x += -Math.sin(this.rotation) * this.enginePower
      this.a.y += Math.cos(this.rotation) * this.enginePower
    }
    if (isDown(' ')) {
      this.v.x *= Math.pow(1 - this.breakPower, delta)
      this.v.y *= Math.pow(1 - this.breakPower, delta)
    }

    this.v.x += this.a.x * delta
    this.v.y += this.a.y * delta

    this.p.x += this.v.x
    this.p.y += this.v.y
  }

  ejectParticle() {
    const particle = new JetParticle(
      {
        x: this.p.x - this.width * PIXEL * Math.sin(this.rotation),
        y: this.p.y + (this.height / 2) * PIXEL * Math.cos(this.rotation),
      },
      {
        x: -100 * this.enginePower * Math.sin(this.rotation),
        y: 100 * this.enginePower * Math.cos(this.rotation),
      },
      this.rotation,
    )

    this.add(particle)
  }
}
