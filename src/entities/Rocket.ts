import { COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import { isDown } from '../engine/input'
import type { Vect } from '../engine/Vect'
import { RigidBody } from '../engine/RigidBody'
import { resolveCollision } from '../engine/Physics'
import { ThrustSound } from '../sounds/ThrustSound'
import { BreakParticle } from './BreakParticle'
import { JetParticle } from './JetParticle'
import { Body } from './Body'

export class Rocket extends Entity {
  body: RigidBody

  bodies: Body[] = []

  enginePower: number = 0.0005
  breakPower: number = 0.001
  rotationPower: number = 0.00005

  isThrustPlaying = false
  thrustSound: ThrustSound

  isBreakPlaying = false
  breakSound: ThrustSound

  constructor(pos: Vect) {
    super()
    this.body = new RigidBody(pos)
    this.body.m = 0.001
    this.body.width = 4
    this.body.height = 10
    this.body.restitution = 0.8
    this.body.landingSpeed = 0.2
    this.body.angularDrag = 0.99
    this.thrustSound = new ThrustSound('DARK')
    this.breakSound = new ThrustSound('BRIGHT')
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderHull(ctx)
    this.renderCockpit(ctx)
    this.renderBreakSystem(ctx)
  }

  renderHull(ctx: CanvasRenderingContext2D) {
    this.renderInPlace(ctx, (ctx) => {
      ctx.fillStyle = COLOR.GREY3
      ctx.fillRect(
        (-this.body.width / 2) * PIXEL,
        (-this.body.height / 2) * PIXEL,
        this.body.width * PIXEL,
        this.body.height * PIXEL,
      )
    })
  }

  renderCockpit(ctx: CanvasRenderingContext2D) {
    this.renderInPlace(ctx, (ctx) => {
      ctx.fillStyle = COLOR.GREEN
      ctx.fillRect(
        (-this.body.width / 4) * PIXEL,
        (-this.body.height / 2) * PIXEL,
        (this.body.width / 2) * PIXEL,
        (this.body.height / 4) * PIXEL,
      )
    })
  }

  renderBreakSystem(ctx: CanvasRenderingContext2D) {
    this.renderInPlace(ctx, (ctx) => {
      ctx.fillStyle = COLOR.PURPLE
      ctx.fillRect((-this.body.width / 8) * PIXEL, -PIXEL, (this.body.width / 4) * PIXEL, PIXEL)
    })
  }

  renderInPlace(ctx: CanvasRenderingContext2D, cb: (ctx: CanvasRenderingContext2D) => void) {
    ctx.save()
    ctx.translate(this.body.position.x, this.body.position.y)
    ctx.rotate(this.body.rotation)
    cb(ctx)
    ctx.restore()
  }

  update(delta: number) {
    this.body.acceleration = { x: 0, y: 0 }
    this.body.angularAcceleration = 0

    this.handleRotation(delta)
    this.handleThrust()
    this.handleBreak(delta)

    resolveCollision(this.body, this.bodies)

    this.body.integrate(delta)
  }

  ejectEngineParticle() {
    const { position: p, rotation: r, width, height } = this.body
    const particle = new JetParticle(
      {
        x: p.x - (width + PIXEL) * PIXEL * Math.sin(r),
        y: p.y + ((height + PIXEL) / 2) * PIXEL * Math.cos(r),
      },
      {
        x: -100 * this.enginePower * Math.sin(r),
        y: 100 * this.enginePower * Math.cos(r),
      },
      r,
    )
    this.add(particle)
  }

  ejectBreakParticle() {
    const particle = new BreakParticle(this.body.position, this.body.velocity)
    this.add(particle)
  }

  handleRotation(delta: number) {
    if (this.body.isLanded) return
    if (isDown('a') || isDown('ArrowLeft')) this.body.angularAcceleration -= this.rotationPower
    if (isDown('d') || isDown('ArrowRight')) this.body.angularAcceleration += this.rotationPower
  }

  handleThrust() {
    if (isDown('w') || isDown('ArrowUp')) {
      this.body.isLanded = false
      if (!this.isThrustPlaying) {
        this.thrustSound.play()
        this.isThrustPlaying = true
      }
      this.body.acceleration.x += Math.sin(this.body.rotation) * this.enginePower
      this.body.acceleration.y += -Math.cos(this.body.rotation) * this.enginePower
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
      this.body.velocity.x *= Math.pow(1 - this.breakPower, delta)
      this.body.velocity.y *= Math.pow(1 - this.breakPower, delta)

      if (Math.abs(this.body.velocity.x) < 0.05) this.body.velocity.x = 0
      if (Math.abs(this.body.velocity.y) < 0.05) this.body.velocity.y = 0

      if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
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
