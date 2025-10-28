/**
 * @param {Float32Array} buffer
 * @param {WebGLRenderingContext} gl
 */
export function updateView(buffer, gl) {
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, buffer.length / 5);
}
