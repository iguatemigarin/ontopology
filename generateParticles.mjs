/**
 * @param {number} count
 * @param {number} speedFactor
 * @returns Float32Array
 */
export function generateParticles(count, speedFactor) {
    const particles = new Float32Array(count * 5);
    for (let i = 0; i < count; i++) {
        const idx = i * 5;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 0.05;
        particles[idx + 0] = Math.cos(angle) * radius; // px
        particles[idx + 1] = Math.sin(angle) * radius; // py
        particles[idx + 2] = (Math.random() - 0.5) * speedFactor; // vx
        particles[idx + 3] = (Math.random() - 0.5) * speedFactor; // vy
        particles[idx + 4] = Math.random() * 2; // mass
    }
    return particles;
}
