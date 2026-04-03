import { G, PIXEL } from '../constants'
import type { Rocket } from '../entities/Rocket'
import type { Body } from '../entities/Body'

export function applyGravity(bodies: Body[], rocket: Rocket) {
  for (const body of bodies) {
    const dx = body.p.x - rocket.position.x
    const dy = body.p.y - rocket.position.y
    const r = Math.sqrt(dx * dx + dy * dy)
    const f = (G * rocket.m * body.m) / (r * r)
    const fx = f * (dx / r)
    const fy = f * (dy / r)
    rocket.acceleration.x += fx / rocket.m
    rocket.acceleration.y += fy / rocket.m
  }
}

export type Collision = { body: Body; normal: { x: number; y: number }; penetration: number }

export function checkCollisions(bodies: Body[], rocket: Rocket): Collision | null {
  const halfW = (rocket.width / 2) * PIXEL
  const halfH = (rocket.height / 2) * PIXEL

  for (const body of bodies) {
    // Transform body center into rocket's local (unrotated) space
    const dx = body.p.x - rocket.position.x
    const dy = body.p.y - rocket.position.y
    const cos = Math.cos(-rocket.rotation)
    const sin = Math.sin(-rocket.rotation)
    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    // Closest point on the rocket rect to the body center
    const closestX = Math.max(-halfW, Math.min(halfW, localX))
    const closestY = Math.max(-halfH, Math.min(halfH, localY))

    const distX = localX - closestX
    const distY = localY - closestY
    const distSq = distX * distX + distY * distY
    const radiusPx = body.radius * PIXEL
    if (distSq <= radiusPx * radiusPx) {
      // Normal in local space, rotated back to world space
      const dist = Math.sqrt(distSq)
      const nx = distX / dist
      const ny = distY / dist
      const worldNx = nx * Math.cos(rocket.rotation) - ny * Math.sin(rocket.rotation)
      const worldNy = nx * Math.sin(rocket.rotation) + ny * Math.cos(rocket.rotation)
      return { body, normal: { x: worldNx, y: worldNy }, penetration: radiusPx - dist }
    }
  }
  return null
}
