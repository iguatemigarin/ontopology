import { G, COLOR, PIXEL } from '../constants'
import { Entity } from '../engine/Entity'
import { isDown } from '../engine/input'
import type { Vect } from '../engine/Vect'
import { ThrustSound } from '../sounds/ThrustSound'
import { BreakParticle } from './BreakParticle'
import { JetParticle } from './JetParticle'
import { Body } from './Body'
import { applyGravity, checkCollisions } from '../engine/Physics'

export class Rocket extends Entity {
  position: Vect
  velocity: Vect = { x: 0, y: 0 }
  acceleration: Vect = { x: 0, y: 0 }
  rotation: number = 0
  angularVelocity: number = 0
  angularAcceleration: number = 0

  m = 0.001
  bodies: Body[] = []

  enginePower: number = 0.0005
  breakPower: number = 0.001
  rotationPower: number = 0.00005
  rotationDrag: number = 0.99
  restitution: number = 0.8
  landingSpeed: number = 0.2

  isLanded: boolean = false

  width: number = 4
  height: number = 10

  isThrustPlaying = false
  thrustSound: ThrustSound

  isBreakPlaying = false
  breakSound: ThrustSound

  constructor(pos: Vect) {
    super()
    this.position = pos
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
        (-this.width / 2) * PIXEL,
        (-this.height / 2) * PIXEL,
        this.width * PIXEL,
        this.height * PIXEL,
      )
    })
  }

  renderCockpit(ctx: CanvasRenderingContext2D) {
    this.renderInPlace(ctx, (ctx) => {
      ctx.fillStyle = COLOR.GREEN
      ctx.fillRect(
        (-this.width / 4) * PIXEL,
        (-this.height / 2) * PIXEL,
        (this.width / 2) * PIXEL,
        (this.height / 4) * PIXEL,
      )
    })
  }

  renderBreakSystem(ctx: CanvasRenderingContext2D) {
    this.renderInPlace(ctx, (ctx) => {
      ctx.fillStyle = COLOR.PURPLE
      ctx.fillRect((-this.width / 8) * PIXEL, -PIXEL, (this.width / 4) * PIXEL, PIXEL)
    })
  }

  renderInPlace(ctx: CanvasRenderingContext2D, cb: (ctx: CanvasRenderingContext2D) => void) {
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation)
    cb(ctx)
    ctx.restore()
  }

  update(delta: number) {
    this.acceleration = { x: 0, y: 0 }
    this.angularAcceleration = 0

    this.handleRotation(delta)
    this.handleThrust()
    this.handleBreak(delta)
    this.handleBodies()

    if (Math.abs(this.rotation) > Math.PI * 2) this.rotation = 0

    this.velocity.x += this.acceleration.x * delta
    this.velocity.y += this.acceleration.y * delta

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

  ejectEngineParticle() {
    const particle = new JetParticle(
      {
        x: this.position.x - (this.width + PIXEL) * PIXEL * Math.sin(this.rotation),
        y: this.position.y + ((this.height + PIXEL) / 2) * PIXEL * Math.cos(this.rotation),
      },
      {
        x: -100 * this.enginePower * Math.sin(this.rotation),
        y: 100 * this.enginePower * Math.cos(this.rotation),
      },
      this.rotation,
    )

    this.add(particle)
  }

  ejectBreakParticle() {
    const particle = new BreakParticle(this.position, this.velocity)
    this.add(particle)
  }

  handleRotation(delta: number) {
    if (isDown('a') || isDown('ArrowLeft')) {
      this.angularAcceleration += -this.rotationPower
    }

    if (isDown('d') || isDown('ArrowRight')) {
      this.angularAcceleration += this.rotationPower
    }

    this.angularVelocity += this.angularAcceleration * delta

    if (Math.abs(this.angularVelocity) > 0.0001) {
      this.angularVelocity *= this.rotationDrag
    } else {
      this.angularVelocity = 0
    }

    this.rotation += this.angularVelocity
  }

  handleThrust() {
    if (isDown('w') || isDown('ArrowUp')) {
      this.isLanded = false
      if (!this.isThrustPlaying) {
        this.thrustSound.play()
        this.isThrustPlaying = true
      }
      this.acceleration.x += Math.sin(this.rotation) * this.enginePower
      this.acceleration.y += -Math.cos(this.rotation) * this.enginePower

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
      this.velocity.x *= Math.pow(1 - this.breakPower, delta)
      this.velocity.y *= Math.pow(1 - this.breakPower, delta)

      if (Math.abs(this.velocity.x) < 0.05) this.velocity.x = 0
      if (Math.abs(this.velocity.y) < 0.05) this.velocity.y = 0

      if (this.velocity.x !== 0 || this.velocity.y !== 0) {
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

  handleBodies() {
    applyGravity(this.bodies, this)
    const collision = checkCollisions(this.bodies, this)
    if (collision) {
      const { normal: n, penetration } = collision

      // Depenetrate: push rocket out along the normal
      this.position.x -= n.x * penetration
      this.position.y -= n.y * penetration

      const dot = this.velocity.x * n.x + this.velocity.y * n.y

      if (!this.isLanded && Math.abs(dot) < this.landingSpeed) {
        // Land: zero out velocity and cancel gravity into the surface each frame
        this.isLanded = true
        this.velocity.x = 0
        this.velocity.y = 0
      } else if (this.isLanded) {
        // Cancel the acceleration component pushing into the surface (normal force)
        const aDot = this.acceleration.x * n.x + this.acceleration.y * n.y
        if (aDot < 0) {
          this.acceleration.x -= aDot * n.x
          this.acceleration.y -= aDot * n.y
        }
        this.velocity.x = 0
        this.velocity.y = 0
      } else {
        // Bounce
        this.velocity.x -= (1 + this.restitution) * dot * n.x
        this.velocity.y -= (1 + this.restitution) * dot * n.y
      }
    } else {
      this.isLanded = false
    }
  }
}
