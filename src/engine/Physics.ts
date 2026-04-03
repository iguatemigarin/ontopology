import { G, PIXEL } from '../constants'
import type { RigidBody } from './RigidBody'
import type { Body } from '../entities/Body'

export function applyGravity(bodies: Body[], rigid: RigidBody) {
  for (const body of bodies) {
    const dx = body.p.x - rigid.position.x
    const dy = body.p.y - rigid.position.y
    const r = Math.sqrt(dx * dx + dy * dy)
    const f = (G * rigid.m * body.m) / (r * r)
    const fx = f * (dx / r)
    const fy = f * (dy / r)
    rigid.acceleration.x += fx / rigid.m
    rigid.acceleration.y += fy / rigid.m
  }
}

export type Collision = {
  body: Body
  normal: { x: number; y: number }
  penetration: number
  contact: { x: number; y: number } // relative to rigid body center, in world space
}

export function checkCollisions(bodies: Body[], rigid: RigidBody): Collision | null {
  const halfW = (rigid.width / 2) * PIXEL
  const halfH = (rigid.height / 2) * PIXEL

  for (const body of bodies) {
    // Transform body center into rigid body's local (unrotated) space
    const dx = body.p.x - rigid.position.x
    const dy = body.p.y - rigid.position.y
    const cos = Math.cos(-rigid.rotation)
    const sin = Math.sin(-rigid.rotation)
    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    // Closest point on the rect to the body center
    const closestX = Math.max(-halfW, Math.min(halfW, localX))
    const closestY = Math.max(-halfH, Math.min(halfH, localY))

    const distX = localX - closestX
    const distY = localY - closestY
    const distSq = distX * distX + distY * distY
    const radiusPx = body.radius * PIXEL
    if (distSq <= radiusPx * radiusPx) {
      const dist = Math.sqrt(distSq)
      const nx = distX / dist
      const ny = distY / dist
      const cosR = Math.cos(rigid.rotation)
      const sinR = Math.sin(rigid.rotation)
      const worldNx = nx * cosR - ny * sinR
      const worldNy = nx * sinR + ny * cosR
      const contactX = closestX * cosR - closestY * sinR
      const contactY = closestX * sinR + closestY * cosR
      return {
        body,
        normal: { x: worldNx, y: worldNy },
        penetration: radiusPx - dist,
        contact: { x: contactX, y: contactY },
      }
    }
  }
  return null
}

export function resolveCollision(rigid: RigidBody, bodies: Body[]) {
  applyGravity(bodies, rigid)
  const collision = checkCollisions(bodies, rigid)
  if (!collision) {
    rigid.isLanded = false
    return
  }

  const { normal: n, penetration, contact: r } = collision

  // Depenetrate
  rigid.position.x -= n.x * penetration
  rigid.position.y -= n.y * penetration

  // Velocity at contact point (includes angular contribution)
  const vContactX = rigid.velocity.x - rigid.angularVelocity * r.y
  const vContactY = rigid.velocity.y + rigid.angularVelocity * r.x
  const vRel = vContactX * n.x + vContactY * n.y

  if (rigid.isLanded) {
    // Normal force: cancel acceleration component pushing into the surface
    const aDot = rigid.acceleration.x * n.x + rigid.acceleration.y * n.y
    if (aDot < 0) {
      rigid.acceleration.x -= aDot * n.x
      rigid.acceleration.y -= aDot * n.y
    }
    rigid.velocity.x = 0
    rigid.velocity.y = 0
    rigid.angularVelocity = 0
  } else if (Math.abs(vRel) < rigid.landingSpeed) {
    rigid.isLanded = true
    rigid.velocity.x = 0
    rigid.velocity.y = 0
    rigid.angularVelocity = 0
  } else {
    // Rigid body impulse with rotation
    const wPx = rigid.width * PIXEL
    const wPy = rigid.height * PIXEL
    const I = rigid.m * (wPx * wPx + wPy * wPy) / 12
    const rCrossN = r.x * n.y - r.y * n.x
    const j = -(1 + rigid.restitution) * vRel / (1 / rigid.m + rCrossN * rCrossN / I)
    rigid.velocity.x += (j / rigid.m) * n.x
    rigid.velocity.y += (j / rigid.m) * n.y
    rigid.angularVelocity += (rCrossN * j) / I
  }
}
