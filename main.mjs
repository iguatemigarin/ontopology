import initWasm, { populate, get_buffer_ptr, get_buffer_len } from './pkg/ontopology.js';
import { initWebGL } from './initWebGL.mjs';
import { generateParticles } from './generateParticles.mjs';
import { loop, updateFps } from './loop.mjs';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PARTICLE_COUNT = 10 * 1000;
const SPEED_FACTOR = 0.01;

const wasm = await initWasm();
const { gl, aspectLoc } = initWebGL(canvas);
const aspect = canvas.width / canvas.height;
gl.viewport(0, 0, canvas.width, canvas.height);
gl.uniform1f(aspectLoc, aspect);

populate(generateParticles(PARTICLE_COUNT, SPEED_FACTOR));

const ptr = get_buffer_ptr();
const len = get_buffer_len();
const buffer = new Float32Array(wasm.memory.buffer, ptr, len);

loop(gl, buffer, aspect);
updateFps();
