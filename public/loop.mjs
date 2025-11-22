import { update } from './pkg/ontopology.js';
import { updateView } from './updateView.mjs';

let frameCount = 0;
let currentFps = 0;
let lastTime = performance.now();

/**
 * @param {WebGLRenderingContext} gl
 * @param {Float32Array} buffer
 * @param {number} aspect
 * @param {number} integrationTimestep
 * @param {number} G
 */
export function loop(gl, buffer, aspect, params) {
    const { G, integrationTimestep } = params
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;

    frameCount++;

    update(delta, aspect, integrationTimestep, G);
    updateView(buffer, gl);

    window.requestAnimationFrame(() => loop(gl, buffer, aspect, params));
}
export function updateFps() {
    currentFps = frameCount;
    frameCount = 0;
    fps.innerText = currentFps;
    setTimeout(updateFps, 1000);
}
