/**
 * @param {number} count
 * @param {number} paramsCount
 * @param {number} massiveness
 * @param {number} distribution
 * @returns Float32Array
 */
export function generateParticles(count, paramsCount, massiveness, distribution) {
    const particles = new Float32Array(count * paramsCount);
    for (let i = 0; i < count; i++) {
        const idx = i * paramsCount;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * distribution;
        particles[idx + 0] = Math.cos(angle) * radius; // px
        particles[idx + 1] = Math.sin(angle) * radius; // py
        particles[idx + 2] = 0; // vx
        particles[idx + 3] = 0; // vy
        particles[idx + 4] = 0; // ax
        particles[idx + 5] = 0; // ay
        // particles[idx + 6] = Math.max(Math.random() * massiveness, 0.1); // mass
        particles[idx + 6] = massiveness; // mass
    }
    return particles;
}
