uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(vUv, center);

  float glow = exp(-dist * 4.0) * (0.8 + 0.2 * sin(uTime * 2.0));

  vec3 color = mix(
    vec3(0.4, 0.69, 0.20),
    vec3(0.0, 0.34, 0.66),
    glow
  );

  float alpha = glow * 0.6;

  gl_FragColor = vec4(color, alpha);
}
