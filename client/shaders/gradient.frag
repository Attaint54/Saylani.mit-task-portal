uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float dist = distance(uv, uMouse);

  vec3 color1 = vec3(0.4, 0.69, 0.20);
  vec3 color2 = vec3(0.0, 0.34, 0.66);
  vec3 color3 = vec3(0.2, 0.5, 0.3);

  float wave = sin(uv.x * 4.0 + uTime * 0.5) * 0.1 + cos(uv.y * 4.0 + uTime * 0.3) * 0.1;
  float mixFactor = uv.x + uv.y * 0.5 + wave;

  vec3 gradient = mix(color1, color2, mixFactor);
  gradient = mix(gradient, color3, sin(uTime * 0.1) * 0.5 + 0.5);

  float glow = exp(-dist * 3.0) * 0.3;
  gradient += glow * vec3(0.6, 0.9, 0.4);

  gl_FragColor = vec4(gradient, 0.8);
}
