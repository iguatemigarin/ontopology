import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.21/+esm';
import initWasm, { populate, get_buffer_ptr, get_buffer_len } from './pkg/ontopology.js';
import { initWebGL } from './initWebGL.mjs';
import { generateParticles } from './generateParticles.mjs';
import { loop, updateFps } from './loop.mjs';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const PARAMS_COUNT = 7;

const PARTICLE_COUNT = 2000;
const MASSIVENESS = 1;
const DISTRIBUTION = 0.75;

/*
px = 0
py = 1
vx = 2
vy = 3
ax = 4
ay = 5
mass = 6
*/

const params = {
    G: 0.00012,
    integrationTimestep: 0.00000001,
    particleCount: 2000,
    massiveness: 1,
    distribution: 0.75
};
const gui = new GUI();
gui.add(params, 'G', 0, 0.001, 0.00001);
gui.add(params, 'integrationTimestep', 0, 0.00001, 0.00000001);

const wasm = await initWasm();
const { gl, aspectLoc } = initWebGL(canvas);
const aspect = canvas.width / canvas.height;
gl.viewport(0, 0, canvas.width, canvas.height);
gl.uniform1f(aspectLoc, aspect);

populate(generateParticles(PARTICLE_COUNT, PARAMS_COUNT, MASSIVENESS, DISTRIBUTION));

const ptr = get_buffer_ptr();
const len = get_buffer_len();
const buffer = new Float32Array(wasm.memory.buffer, ptr, len);

loop(gl, buffer, aspect, params);
updateFps();
