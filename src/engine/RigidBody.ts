import type { Vect } from './Vect'

export class RigidBody {
  position: Vect
  velocity: Vect = { x: 0, y: 0 }
  acceleration: Vect = { x: 0, y: 0 }
  rotation: number = 0
  angularVelocity: number = 0
  angularAcceleration: number = 0

  m: number = 1
  width: number = 1
  height: number = 1
  restitution: number = 0.8
  landingSpeed: number = 0.2
  angularDrag: number = 0.99
  isLanded: boolean = false

  constructor(position: Vect) {
    this.position = position
  }

  integrate(delta: number) {
    this.velocity.x += this.acceleration.x * delta
    this.velocity.y += this.acceleration.y * delta
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.angularVelocity += this.angularAcceleration * delta
    if (Math.abs(this.angularVelocity) > 0.0001) {
      this.angularVelocity *= this.angularDrag
    } else {
      this.angularVelocity = 0
    }
    this.rotation += this.angularVelocity
    if (Math.abs(this.rotation) > Math.PI * 2) this.rotation = 0
  }
}
