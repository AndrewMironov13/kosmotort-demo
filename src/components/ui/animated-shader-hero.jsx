import { useEffect, useRef } from 'react'

const vertexShader = `#version 300 es
precision highp float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragmentShader = `#version 300 es
precision highp float;
out vec4 outputColor;
uniform vec2 resolution;
uniform float time;
uniform vec2 pointer;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + 17.17;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= resolution.x / resolution.y;

  float t = time * 0.075;
  float grain = fbm(p * 2.2 + vec2(t, -t * 0.65));
  float pointerPull = exp(-length(uv - pointer) * 4.4);

  float ribbonA = exp(-pow(abs(
    p.y - 0.18 * sin(p.x * 2.4 + t * 3.0) - (grain - 0.5) * 0.22
  ) * 2.2, 2.0));
  float ribbonB = exp(-pow(abs(
    p.y + 0.28 - 0.15 * cos(p.x * 2.0 - t * 2.2) + (grain - 0.5) * 0.18
  ) * 2.5, 2.0));
  float halo = exp(-length(p - vec2(-0.42, 0.18)) * 1.75);

  float strength = ribbonA * 0.52 + ribbonB * 0.34 + halo * 0.28;
  strength += pointerPull * 0.07;

  vec3 cream = vec3(0.97, 0.90, 0.80);
  vec3 rose = vec3(0.88, 0.69, 0.64);
  vec3 gold = vec3(0.78, 0.57, 0.36);
  vec3 color = mix(cream, rose, clamp(ribbonA * 0.52 + grain * 0.18, 0.0, 1.0));
  color = mix(color, gold, clamp(ribbonB * 0.35, 0.0, 0.35));

  float edgeFade = 1.0 - smoothstep(0.12, 0.95, length(p * vec2(0.72, 1.0)));
  float alpha = clamp(strength * edgeFade * 0.18, 0.0, 0.16);
  outputColor = vec4(color, alpha);
}`

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function AnimatedShaderHero({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return undefined

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    })
    if (!gl) return undefined

    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vertex || !fragment) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    gl.useProgram(program)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolution = gl.getUniformLocation(program, 'resolution')
    const time = gl.getUniformLocation(program, 'time')
    const pointer = gl.getUniformLocation(program, 'pointer')
    const pointerValue = { x: 0.24, y: 0.62 }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let visible = true

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const render = (now = 0) => {
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.uniform2f(resolution, canvas.width, canvas.height)
      gl.uniform1f(time, now * 0.001)
      gl.uniform2f(pointer, pointerValue.x, pointerValue.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (visible && !reducedMotion) frame = requestAnimationFrame(render)
    }

    const onPointerMove = (event) => {
      const rect = parent.getBoundingClientRect()
      pointerValue.x = (event.clientX - rect.left) / rect.width
      pointerValue.y = 1 - (event.clientY - rect.top) / rect.height
    }

    const resizeObserver = new ResizeObserver(resize)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting
      if (nextVisible && !visible && !reducedMotion) {
        visible = true
        frame = requestAnimationFrame(render)
      } else if (!nextVisible) {
        visible = false
        cancelAnimationFrame(frame)
      }
    })

    resizeObserver.observe(parent)
    intersectionObserver.observe(parent)
    parent.addEventListener('pointermove', onPointerMove, { passive: true })
    resize()
    render(0)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      parent.removeEventListener('pointermove', onPointerMove)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [])

  return <canvas ref={canvasRef} className={`animated-shader ${className}`} aria-hidden="true" />
}
