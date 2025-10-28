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
// const INTEGRATION_TIMESTEP = 0.00000015; // stable
// const G = 0.000015; // stable

const INTEGRATION_TIMESTEP = 0.00000001; // beautiful
const G = 0.00012; // beautiful
/*
px = 0
py = 1
vx = 2
vy = 3
ax = 4
ay = 5
mass = 6
*/

const wasm = await initWasm();
const { gl, aspectLoc } = initWebGL(canvas);
const aspect = canvas.width / canvas.height;
gl.viewport(0, 0, canvas.width, canvas.height);
gl.uniform1f(aspectLoc, aspect);

populate(generateParticles(PARTICLE_COUNT, PARAMS_COUNT, MASSIVENESS, DISTRIBUTION));

const ptr = get_buffer_ptr();
const len = get_buffer_len();
const buffer = new Float32Array(wasm.memory.buffer, ptr, len);

loop(gl, buffer, aspect, INTEGRATION_TIMESTEP, G);
updateFps();
