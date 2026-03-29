import { COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import { isDown } from '../engine/input'
import type { Vect } from '../engine/Vect'
import { ThrustSound } from '../sounds/ThrustSound'
import { BreakParticle } from './BreakParticle'
import { JetParticle } from './JetParticle'

export class Rocket extends Entity {
  p: Vect
  v: Vect = { x: 0, y: 0 }
  a: Vect = { x: 0, y: 0 }
  r: number = 0
  enginePower: number = 0.0001
  breakPower: number = 0.001
  rotationPower: number = 0.001

  width: number = 4
  height: number = 10

  isThrustPlaying = false
  thrustSound: ThrustSound

  isBreakPlaying = false
  breakSound: ThrustSound

  constructor(pos: Vect) {
    super()
    this.p = pos
    this.thrustSound = new ThrustSound('DARK')
    this.breakSound = new ThrustSound('BRIGHT')
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderHull(ctx)
    this.renderCockpit(ctx)
    this.renderBreakSystem(ctx)
  }

  renderHull(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.p.x, this.p.y)
    ctx.rotate(this.r)
    ctx.fillStyle = COLOR.GREY3
    ctx.fillRect(
      (-this.width / 2) * PIXEL,
      (-this.height / 2) * PIXEL,
      this.width * PIXEL,
      this.height * PIXEL,
    )
    ctx.restore()
  }

  renderCockpit(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.p.x, this.p.y)
    ctx.rotate(this.r)
    ctx.fillStyle = COLOR.GREEN
    ctx.fillRect(
      (-this.width / 4) * PIXEL,
      (-this.height / 2) * PIXEL,
      (this.width / 2) * PIXEL,
      (this.height / 4) * PIXEL,
    )
    ctx.restore()
  }

  renderBreakSystem(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.p.x, this.p.y)
    ctx.rotate(this.r)
    ctx.fillStyle = COLOR.PURPLE
    ctx.fillRect((-this.width / 8) * PIXEL, -PIXEL, (this.width / 4) * PIXEL, PIXEL)
    ctx.restore()
  }

  update(delta: number) {
    this.a = { x: 0, y: 0 }

    this.handleRotation(delta)
    this.handleThrust()
    this.handleBreak(delta)

    this.v.x += this.a.x * delta
    this.v.y += this.a.y * delta

    this.p.x += this.v.x
    this.p.y += this.v.y
  }

  ejectEngineParticle() {
    const particle = new JetParticle(
      {
        x: this.p.x - (this.width + PIXEL) * PIXEL * Math.sin(this.r),
        y: this.p.y + ((this.height + PIXEL) / 2) * PIXEL * Math.cos(this.r),
      },
      {
        x: -100 * this.enginePower * Math.sin(this.r),
        y: 100 * this.enginePower * Math.cos(this.r),
      },
      this.r,
    )

    this.add(particle)
  }

  ejectBreakParticle() {
    const particle = new BreakParticle(this.p, this.v)
    this.add(particle)
  }

  handleRotation(delta: number) {
    if (isDown('a') || isDown('ArrowLeft')) this.r += -this.rotationPower * delta
    if (isDown('d') || isDown('ArrowRight')) this.r += this.rotationPower * delta
    if (Math.abs(this.r) > Math.PI * 2) this.r = 0
  }

  handleThrust() {
    if (isDown('w') || isDown('ArrowUp')) {
      if (!this.isThrustPlaying) {
        this.thrustSound.play()
        this.isThrustPlaying = true
      }
      this.a.x += Math.sin(this.r) * this.enginePower
      this.a.y += -Math.cos(this.r) * this.enginePower

      this.ejectEngineParticle()
    } else {
      if (this.isThrustPlaying) {
        this.thrustSound.stop()
        this.isThrustPlaying = false
      }
    }
  }

  handleBreak(delta: number) {
    if (isDown(' ')) {
      this.v.x *= Math.pow(1 - this.breakPower, delta)
      this.v.y *= Math.pow(1 - this.breakPower, delta)

      if (Math.abs(this.v.x) < 0.05) this.v.x = 0
      if (Math.abs(this.v.y) < 0.05) this.v.y = 0

      if (this.v.x !== 0 || this.v.y !== 0) {
        if (!this.isBreakPlaying) {
          this.isBreakPlaying = true
          this.breakSound.play()
        }
        this.ejectBreakParticle()
      } else {
        if (this.isBreakPlaying) {
          this.isBreakPlaying = false
          this.breakSound.stop()
        }
      }
    } else {
      if (this.isBreakPlaying) {
        this.isBreakPlaying = false
        this.breakSound.stop()
      }
    }
  }
}
