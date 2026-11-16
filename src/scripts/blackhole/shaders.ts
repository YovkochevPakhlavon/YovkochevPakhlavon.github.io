/**
 * GLSL for the Home black hole.
 *
 * Physics (units: Schwarzschild radius r_s = 1, so M = 1/2, G = c = 1):
 * each pixel shoots a light ray from the camera and integrates the null geodesic of the
 * Schwarzschild metric in Cartesian form,  x'' = -(3/2) h² x / r⁵,  h = |x × x'|
 * (equivalent to the Binet equation u'' + u = (3/2) u²). Rays that reach r < 1 fall into
 * the horizon (shadow); rays that cross the equatorial plane between the ISCO (r = 3) and
 * R_OUT hit a thin Keplerian disk. Disk brightness uses a Novikov–Thorne-like profile with
 * Doppler beaming and gravitational redshift: I ∝ g³, g = √(1 − 1/r) / (γ (1 − β·n)).
 * Rays skimming the photon sphere (r = 1.5) add the thin photon ring.
 */

export const VERTEX = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAGMENT = /* glsl */ `#version 300 es
precision highp float;

uniform vec2 uRes;     // canvas size in pixels
uniform float uTime;   // seconds (animation time)
uniform vec2 uTilt;    // camera tilt from the pointer (radians): x = yaw, y = inclination
uniform int uSteps;    // integration steps (quality)

out vec4 outColor;

const float R_IN = 3.0;      // ISCO = 3 r_s
const float R_OUT = 7.2;
const float CAM_DIST = 30.0;
const float TAN_HALF = 0.27; // field of view: shadow ≈ 32 % of the box, like the CSS version
const vec3 AMBER = vec3(0.949, 0.647, 0.255);  // --accent #F2A541
const vec3 HOT = vec3(1.0, 0.86, 0.62);        // white-hot, Doppler-boosted side
const vec3 DEEP = vec3(0.78, 0.33, 0.08);       // redshifted, receding side

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

// Emission and opacity of the disk at point p, seen along ray direction dir.
vec3 disk(vec3 p, vec3 dir, out float alpha) {
  float r = length(p.xz);
  float v = sqrt(0.5 / r);                       // Keplerian speed, M = 1/2
  vec3 tangent = normalize(vec3(-p.z, 0.0, p.x)); // orbital direction
  float gamma = inversesqrt(1.0 - v * v);
  float doppler = 1.0 / (gamma * (1.0 - dot(tangent * v, -dir)));
  float g = doppler * sqrt(max(1.0 - 1.0 / r, 0.0));

  float x = R_IN / r;
  float profile = max(x * x * x * (1.0 - sqrt(x)), 0.0) * 14.0;

  // Differential rotation (inner parts faster) shears the noise into streaks.
  vec2 q = rot(uTime * v / r) * p.xz;
  float tex = 0.55 + 0.30 * noise(q * 1.7) + 0.15 * noise(q * 4.3 + 7.0);

  float edge = smoothstep(R_IN, R_IN + 0.35, r) * (1.0 - smoothstep(R_OUT - 2.5, R_OUT, r));
  float boost = g * g * g * g;                    // beaming: approaching side much brighter
  float intensity = profile * tex * boost * edge;
  alpha = clamp(intensity * 1.1, 0.0, 0.92) * edge;
  vec3 tint = g < 1.0
    ? mix(DEEP, AMBER, smoothstep(0.55, 1.0, g))
    : mix(AMBER, HOT, smoothstep(1.0, 1.6, g));
  return tint * intensity;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / (0.5 * uRes.y);
  // Fade towards the canvas border so nothing is cut off with a hard edge.
  float vignette = 1.0 - smoothstep(0.82, 0.99, max(abs(uv.x), abs(uv.y)));
  uv = rot(radians(10.0)) * uv;                  // same tilt as the CSS ellipse (rotate(-10deg))

  float incl = radians(77.0) + uTilt.y;          // angle between view and disk normal
  float yaw = uTilt.x;
  vec3 cam = CAM_DIST * vec3(sin(incl) * sin(yaw), cos(incl), -sin(incl) * cos(yaw));
  vec3 fwd = normalize(-cam);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(right, fwd);

  vec3 pos = cam;
  vec3 vel = normalize(fwd + (uv.x * right + uv.y * up) * TAN_HALF);
  vec3 hv = cross(pos, vel);
  float h2 = dot(hv, hv);

  vec3 col = vec3(0.0);
  float a = 0.0;
  float minR = 1e3;
  bool captured = false;

  for (int i = 0; i < 256; i++) {
    if (i >= uSteps) break;
    float r2 = dot(pos, pos);
    float r = sqrt(r2);
    minR = min(minR, r);
    if (r < 1.0) { captured = true; break; }

    float dt = clamp(0.11 * (r - 0.9), 0.025, 2.2);
    vel += -1.5 * h2 * pos / (r2 * r2 * r) * dt;
    vec3 next = pos + vel * dt;

    if (pos.y * next.y < 0.0) {                  // crossed the disk plane
      vec3 p = mix(pos, next, pos.y / (pos.y - next.y));
      float rr = length(p.xz);
      if (rr > R_IN && rr < R_OUT) {
        float al;
        vec3 c = disk(p, normalize(vel), al);
        col += (1.0 - a) * c;
        a += (1.0 - a) * al;
        if (a > 0.97) break;
      }
    }
    pos = next;
    if (r > CAM_DIST * 1.15 && dot(pos, vel) > 0.0) break;   // escaped
  }

  // Photon ring and soft glow around the shadow (the CSS version's amber halo).
  float ring = exp(-pow((minR - 1.52) / 0.07, 2.0));
  float glow = exp(-(minR - 1.5) * 1.0) * 0.12;
  if (!captured) {
    col += (1.0 - a) * mix(AMBER, HOT, ring * 0.5) * (ring * 2.4 + glow);
    a += (1.0 - a) * clamp(ring * 0.9 + glow * 0.8, 0.0, 1.0);
  } else {
    a = 1.0;                                     // the shadow is black
  }

  // Tone mapping that keeps the amber hue (scales by luminance instead of per channel).
  float lum = max(col.r, max(col.g, col.b));
  col *= (1.0 - exp(-lum * 1.5)) / max(lum, 1e-4);
  float alpha = clamp(max(a, max(col.r, max(col.g, col.b))), 0.0, 1.0);
  outColor = vec4(col, alpha) * vignette;        // premultiplied
}
`;
