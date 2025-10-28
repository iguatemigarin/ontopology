attribute vec2 a_position;
attribute float a_mass;
uniform float u_aspect;

void main() {
    vec2 pos = a_position;
    pos.x /= u_aspect;
    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = a_mass + 1.0;
}
