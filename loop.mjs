import { update } from './pkg/ontopology.js';
import { updateView } from './updateView.mjs';

let frameCount = 0;
let currentFps = 0;
let lastTime = performance.now();

/**
 * @param {WebGLRenderingContext} gl
 * @param {Float32Array} buffer
 * @param {number} aspect
 */
export function loop(gl, buffer, aspect) {
    const now = performance.now();
    const delta = now - lastTime;
    lastTime = now;

    frameCount++;

    update(delta, aspect);
    updateView(buffer, gl);

    window.requestAnimationFrame(() => loop(gl, buffer, aspect));
}
export function updateFps() {
    currentFps = frameCount;
    frameCount = 0;
    fps.innerText = currentFps;
    setTimeout(updateFps, 1000);
}
