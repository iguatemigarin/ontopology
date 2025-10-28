const [vertexSrc, fragmentSrc] = await Promise.all([
    fetch('./vertex.glsl').then(r => r.text()),
    fetch('./fragment.glsl').then(r => r.text()),
]);


/**
 *  [px, py, vx, vy, mass]
 *   0   4   8   12  16    <- byte offsets
 * @param {HTMLCanvasElement} canvas
 */
export function initWebGL(canvas) {
    const gl = canvas.getContext('webgl');

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSrc);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('Vertex shader error: ', gl.getShaderInfoLog(vertexShader));
        throw gl.getShaderInfoLog(vertexShader)
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSrc);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('Fragment shader error: ', gl.getShaderInfoLog(fragmentShader));
        throw gl.getShaderInfoLog(fragmentShader)
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        throw gl.getProgramInfoLog(program);
    }
    gl.useProgram(program);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const massLoc = gl.getAttribLocation(program, 'a_mass');
    const aspectLoc = gl.getUniformLocation(program, 'u_aspect');

    gl.enableVertexAttribArray(positionLoc);
    gl.enableVertexAttribArray(massLoc);

    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(massLoc, 1, gl.FLOAT, false, 20, 16);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    return { gl, aspectLoc };
}
