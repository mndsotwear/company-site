'use client'

import { useEffect, useRef, useState } from 'react'
import type * as THREE from 'three'
import { RouteMap } from '@/components/motion/RouteMap'

// کره‌ی زمین سه‌بعدی هیرو: زوم روی خلیج فارس، کمان‌های نورانی از آبادان و خرمشهر به بنادر مقصد
// و کشتی‌های کوچکی که روی مسیرها حرکت می‌کنند. رنگ‌ها از تم فعلی سایت خوانده می‌شوند.
// روی دستگاه‌های ضعیف، اینترنت کم‌حجم یا «کاهش حرکت»، نسخه‌ی سبک (نمودار مسیر SVG) نمایش داده می‌شود
// و کتابخانه‌ی three.js اصلاً دانلود نمی‌شود.

// [عرض، طول] جغرافیایی؛ ترتیب مثل messages.ports: آبادان، خرمشهر، ام‌القصر، بصره، کویت، دبی
const PORTS: [number, number][] = [
  [30.34, 48.3],
  [30.44, 48.18],
  [30.03, 47.95],
  [30.5, 47.8],
  [29.37, 47.98],
  [25.27, 55.3],
]

// جابه‌جایی برچسب‌ها (پیکسل) تا روی هم نیفتند؛ null یعنی برچسب نشان داده نشود (خرمشهر کنار آبادان است)
const LABEL_OFFSET: ([number, number] | null)[] = [[46, -14], null, [-54, 26], [-50, -26], [-10, 34], [0, -26]]

function strongDevice(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } }
  if (nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType || '')) return false
  if ((nav.hardwareConcurrency || 2) < 4) return false
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** رنگ CSS (هر قالبی، حتی hsl با فاصله) ← هگز که three.js بفهمد */
function cssColor(name: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return fallback
  ctx.fillStyle = fallback
  ctx.fillStyle = raw
  return String(ctx.fillStyle)
}

export function Globe({ names, rtl }: { names: string[]; rtl: boolean }) {
  const [mode, setMode] = useState<'pending' | '3d' | 'lite'>('pending')
  const mount = useRef<HTMLDivElement>(null)
  const labels = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => setMode(strongDevice() ? '3d' : 'lite'), [])

  useEffect(() => {
    if (mode !== '3d' || !mount.current) return
    const host = mount.current
    let disposed = false
    let cleanup = () => {}

    import('three')
      .then((T3) => {
        if (disposed) return
        const W = () => host.clientWidth || 1
        const H = () => host.clientHeight || 1

        const renderer = new T3.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setSize(W(), H())
        host.appendChild(renderer.domElement)

        const scene = new T3.Scene()
        const camera = new T3.PerspectiveCamera(35, W() / H(), 0.01, 100)
        camera.position.set(0, 0, 5.2)

        const world = new T3.Group()
        scene.add(world)

        // مختصات جغرافیایی ← نقطه روی کره
        const toVec = (lat: number, lon: number, r = 1) => {
          const phi = ((90 - lat) * Math.PI) / 180
          const theta = ((lon + 180) * Math.PI) / 180
          return new T3.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
        }

        // کره‌ی داخلی (پوشاندن نقطه‌های پشت کره)
        const core = new T3.Mesh(new T3.SphereGeometry(0.995, 64, 64), new T3.MeshBasicMaterial({ color: '#050a18' }))
        world.add(core)

        // پوسته‌ی نقطه‌ای (توزیع یکنواخت فیبوناچی)
        const N = 9000
        const pos = new Float32Array(N * 3)
        const golden = Math.PI * (3 - Math.sqrt(5))
        for (let i = 0; i < N; i++) {
          const y = 1 - (i / (N - 1)) * 2
          const r = Math.sqrt(1 - y * y)
          const th = golden * i
          pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3)
        }
        const dotsGeo = new T3.BufferGeometry()
        dotsGeo.setAttribute('position', new T3.BufferAttribute(pos, 3))
        const dotsMat = new T3.PointsMaterial({ size: 0.011, transparent: true, opacity: 0.85, sizeAttenuation: true })
        world.add(new T3.Points(dotsGeo, dotsMat))

        // هاله‌ی جو (درخشش لبه‌ها)
        const atmoMat = new T3.ShaderMaterial({
          uniforms: { c: { value: new T3.Color('#22d3ee') } },
          vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
          fragmentShader: 'uniform vec3 c; varying vec3 vN; void main(){ float i = pow(0.75 - dot(vN, vec3(0.0,0.0,1.0)), 2.0) * 1.6; gl_FragColor = vec4(c, 1.0) * i; }',
          blending: T3.AdditiveBlending,
          side: T3.BackSide,
          transparent: true,
        })
        scene.add(new T3.Mesh(new T3.SphereGeometry(1.18, 64, 64), atmoMat))

        // بنادر
        const portVecs = PORTS.map(([la, lo]) => toVec(la, lo, 1.002))
        const markerMat = new T3.MeshBasicMaterial({ color: '#ffffff' })
        const ringMat = new T3.MeshBasicMaterial({ color: '#22d3ee', transparent: true, side: T3.DoubleSide })
        const rings: THREE.Mesh[] = []
        portVecs.forEach((v, i) => {
          const dot = new T3.Mesh(new T3.SphereGeometry(i === 0 ? 0.012 : 0.008, 16, 16), markerMat)
          dot.position.copy(v)
          world.add(dot)
          const ring = new T3.Mesh(new T3.RingGeometry(0.016, 0.02, 40), ringMat.clone())
          ring.position.copy(v)
          ring.lookAt(v.clone().multiplyScalar(2))
          ring.userData.phase = i * 0.7
          world.add(ring)
          rings.push(ring)
        })

        // کمان‌های مسیر و کشتی‌های متحرک
        const arcMat = new T3.MeshBasicMaterial({ color: '#818cf8', transparent: true, opacity: 0.9 })
        const shipMat = new T3.MeshBasicMaterial({ color: '#ffffff' })
        const arcs: { geo: THREE.TubeGeometry; total: number; curve: THREE.CubicBezierCurve3; ship: THREE.Mesh; t: number; speed: number; delay: number }[] = []
        ;[0, 1].forEach((o) =>
          [2, 3, 4, 5].forEach((d, k) => {
            const a = portVecs[o]
            const b = portVecs[d]
            const dist = a.distanceTo(b)
            // مسیرهای کوتاه (بصره، ام‌القصر) کمان بلندتری می‌گیرند تا دیده شوند
            const lift = 1 + Math.max(dist * 1.6, 0.16)
            const c1 = a.clone().lerp(b, 0.25).normalize().multiplyScalar(lift)
            const c2 = a.clone().lerp(b, 0.75).normalize().multiplyScalar(lift)
            const curve = new T3.CubicBezierCurve3(a, c1, c2, b)
            const geo = new T3.TubeGeometry(curve, 80, o === 0 ? 0.0028 : 0.0016, 6, false)
            const total = geo.index ? geo.index.count : 0
            geo.setDrawRange(0, 0)
            world.add(new T3.Mesh(geo, arcMat))
            const ship = new T3.Mesh(new T3.SphereGeometry(0.008, 12, 12), shipMat)
            ship.visible = false
            world.add(ship)
            arcs.push({ geo, total, curve, ship, t: Math.random(), speed: 0.06 + Math.random() * 0.05, delay: 0.6 + k * 0.25 + o * 0.5 })
          }),
        )

        // جهت‌گیری: مرکز منطقه رو به دوربین، شمال رو به بالا
        // مرکز دید کمی جنوب‌تر از منطقه، تا منطقه را از زاویه ببینیم و ارتفاع کمان‌ها دیده شود
        const focus = toVec(4, 50.6).normalize()
        const base = new T3.Quaternion().setFromUnitVectors(focus, new T3.Vector3(0, 0, 1))
        const north = new T3.Vector3(0, 1, 0).applyQuaternion(base)
        const roll = Math.atan2(north.x, north.y)
        const baseQ = new T3.Quaternion().setFromAxisAngle(new T3.Vector3(0, 0, 1), roll).multiply(base)

        // رنگ‌ها از تم
        const paint = () => {
          const primary = cssColor('--primary', '#22d3ee')
          const accent = cssColor('--accent', '#818cf8')
          const deep = cssColor('--deep', '#050a18')
          dotsMat.color.set(primary)
          ;(atmoMat.uniforms.c.value as THREE.Color).set(primary)
          ;(core.material as THREE.MeshBasicMaterial).color.set(deep)
          arcMat.color.set(accent)
          rings.forEach((r) => (r.material as THREE.MeshBasicMaterial).color.set(primary))
        }
        paint()
        const obs = new MutationObserver(paint)
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette', 'style'] })
        window.addEventListener('shahin-palette-change', paint)

        // حرکت ماوس ← کمی چرخش (حس عمق)
        const mouse = { x: 0, y: 0 }
        const onMove = (e: PointerEvent) => {
          mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
          mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('pointermove', onMove)

        const onResize = () => {
          camera.aspect = W() / H()
          camera.updateProjectionMatrix()
          renderer.setSize(W(), H())
        }
        const ro = new ResizeObserver(onResize)
        ro.observe(host)

        // فقط وقتی دیده می‌شود رندر کن
        let visible = true
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
        io.observe(host)

        const clock = new T3.Clock()
        const tmp = new T3.Vector3()
        const camDir = new T3.Vector3()
        let raf = 0
        const loop = () => {
          raf = requestAnimationFrame(loop)
          if (!visible || document.hidden) return
          const t = clock.getElapsedTime()
          // ورود سینمایی: از دور به نزدیک
          const intro = Math.min(1, t / 3.2)
          const ease = 1 - Math.pow(1 - intro, 4)
          camera.position.z = 5.2 - ease * 2.45
          // چرخش آرام + ماوس
          const sway = new T3.Quaternion().setFromEuler(new T3.Euler(0.12 + mouse.y * 0.05, Math.sin(t * 0.15) * 0.12 + mouse.x * 0.08, 0))
          world.quaternion.copy(sway).multiply(baseQ)
          // کشیده شدن کمان‌ها و حرکت کشتی‌ها
          arcs.forEach((a) => {
            const p = Math.max(0, Math.min(1, (t - a.delay) / 1.6))
            a.geo.setDrawRange(0, Math.floor(a.total * p))
            if (p >= 1) {
              a.ship.visible = true
              a.t = (a.t + a.speed * 0.016) % 1
              a.ship.position.copy(a.curve.getPoint(a.t))
            }
          })
          rings.forEach((r) => {
            const k = (Math.sin(t * 2 + r.userData.phase) + 1) / 2
            r.scale.setScalar(1 + k * 1.6)
            ;(r.material as THREE.MeshBasicMaterial).opacity = 0.9 - k * 0.8
          })
          renderer.render(scene, camera)
          // برچسب‌های HTML روی بنادر
          camera.getWorldDirection(camDir)
          portVecs.forEach((v, i) => {
            const el = labels.current[i]
            if (!el) return
            tmp.copy(v).applyQuaternion(world.quaternion)
            const facing = tmp.clone().normalize().dot(camDir) < -0.2
            tmp.project(camera)
            const off = LABEL_OFFSET[i]
            if (!off) return
            el.style.transform = `translate(${((tmp.x + 1) / 2) * W() + off[0]}px, ${((1 - tmp.y) / 2) * H() + off[1]}px) translate(-50%, -50%)`
            el.style.opacity = facing && t > 2.2 ? '1' : '0'
          })
        }
        loop()

        cleanup = () => {
          cancelAnimationFrame(raf)
          obs.disconnect()
          ro.disconnect()
          io.disconnect()
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('shahin-palette-change', paint)
          scene.traverse((o) => {
            const m = o as THREE.Mesh
            m.geometry?.dispose?.()
            const mat = m.material as THREE.Material | THREE.Material[] | undefined
            if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
            else mat?.dispose?.()
          })
          renderer.dispose()
          renderer.domElement.remove()
        }
      })
      .catch(() => setMode('lite'))

    return () => {
      disposed = true
      cleanup()
    }
  }, [mode])

  if (mode === 'lite') {
    return (
      <div className="glass-dark rounded-[2rem] p-4 text-foam sm:p-6">
        <RouteMap names={names} rtl={rtl} />
      </div>
    )
  }

  return (
    <div
      ref={mount}
      className="relative aspect-square w-full [mask-image:radial-gradient(circle_at_center,black_62%,transparent_76%)]"
      aria-hidden
    >
      {/* هاله‌ی نرم پشت کره تا قبل از آماده شدن */}
      <div className="pointer-events-none absolute inset-[12%] rounded-full bg-primary/20 blur-3xl" />
      {names.map((n, i) => LABEL_OFFSET[i] && (
        <span
          key={n}
          ref={(el) => {
            labels.current[i] = el
          }}
          className={`pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold opacity-0 transition-opacity duration-700 glass-dark ${
            i === 0 ? 'text-foam' : 'text-foam/80'
          }`}
        >
          {n}
        </span>
      ))}
    </div>
  )
}
