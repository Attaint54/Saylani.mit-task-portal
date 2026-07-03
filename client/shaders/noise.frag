uniform float uTime;

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(random(i + vec2(0.0, 0.0)), random(i + vec2(1.0, 0.0)), u.x),
    mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec2 uv = vUv * 3.0;

  float n = noise(uv + uTime * 0.05);

  vec3 color1 = vec3(0.4, 0.69, 0.20);
  vec3 color2 = vec3(0.0, 0.34, 0.66);

  vec3 color = mix(color1, color2, n);

  float alpha = 0.15 + n * 0.2;

  gl_FragColor = vec4(color, alpha);
}
