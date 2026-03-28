import { COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import { isDown } from '../engine/input'
import type { Vect } from '../engine/Vect'

export class Rocket extends Entity {
  pos: Vect
  acceleration: Vect = { x: 0, y: 0 }
  velocity: Vect = { x: 0, y: 0 }
  enginePower: number = 0.001
  breakPower: number = 0.001
  rotationPower: number = 0.001
  rotation: number = 0

  width: number = 10
  height: number = 20

  constructor(pos: Vect) {
    super()
    this.pos = pos
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
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
      (-this.height / 1.3) * PIXEL,
      (this.width / 2) * PIXEL,
      (this.height / 3) * PIXEL,
    )

    ctx.restore()
  }

  update(delta: number) {
    this.acceleration = { x: 0, y: 0 }

    if (isDown('a') || isDown('ArrowLeft')) this.rotation += -this.rotationPower * delta
    if (isDown('d') || isDown('ArrowRight')) this.rotation += this.rotationPower * delta

    if (Math.abs(this.rotation) > Math.PI * 2) this.rotation = 0

    if (isDown('w') || isDown('ArrowUp')) {
      this.acceleration.x += Math.sin(this.rotation) * this.enginePower
      this.acceleration.y += -Math.cos(this.rotation) * this.enginePower
    }
    if (isDown('s') || isDown('ArrowDown')) {
      this.acceleration.x += -Math.sin(this.rotation) * this.enginePower
      this.acceleration.y += Math.cos(this.rotation) * this.enginePower
    }
    if (isDown(' ')) {
      this.velocity.x *= Math.pow(1 - this.breakPower, delta)
      this.velocity.y *= Math.pow(1 - this.breakPower, delta)
    }

    this.velocity.x += this.acceleration.x * delta
    this.velocity.y += this.acceleration.y * delta

    this.pos.x += this.velocity.x
    this.pos.y += this.velocity.y
  }
}
