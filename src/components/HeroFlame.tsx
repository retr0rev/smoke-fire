import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function TopBun() {
  const geom = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 48, 32)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      if (y < 0.25) pos.setY(i, 0.25)
      if (y > 0.6) pos.setY(i, y * 0.9)
      const nx = x + Math.sin(y * 4) * 0.02 + Math.cos(z * 3) * 0.02
      const nz = z + Math.cos(y * 3) * 0.02 + Math.sin(x * 4) * 0.02
      pos.setX(i, nx)
      pos.setZ(i, nz)
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geom} position={[0, 0.9, 0]} scale={[1.15, 0.55, 1.15]} castShadow>
      <meshStandardMaterial color="#c97d3a" roughness={0.8} metalness={0.05} />
    </mesh>
  )
}

function SesameSeeds() {
  const seeds = useMemo(() => {
    const s: { pos: [number, number, number]; rot: [number, number, number] }[] = []
    for (let i = 0; i < 50; i++) {
      const phi = Math.random() * Math.PI * 0.45
      const theta = Math.random() * Math.PI * 2
      const r = 1.08
      s.push({
        pos: [r * Math.sin(phi) * Math.cos(theta), 0.57 + Math.sin(phi) * 0.45, r * Math.sin(phi) * Math.sin(theta)],
        rot: [Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5],
      })
    }
    return s
  }, [])

  const seedGeom = useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.02, 0.06, 4, 4)
    g.rotateX(Math.PI / 2)
    return g
  }, [])

  return (
    <group>
      {seeds.map((s, i) => (
        <mesh key={i} geometry={seedGeom} position={s.pos} rotation={s.rot}>
          <meshStandardMaterial color="#f5deb3" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Patty() {
  const geom = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.9, 0.92, 0.2, 48, 4)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const noise = Math.sin(x * 20) * Math.cos(z * 20) * 0.01 + Math.sin(y * 15) * 0.005
      pos.setX(i, x + noise)
      pos.setZ(i, z + noise)
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geom} position={[0, 0.25, 0]} castShadow>
      <meshStandardMaterial color="#3d1c00" roughness={0.9} metalness={0.1} />
    </mesh>
  )
}

function Cheese() {
  const geom = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-1, -0.35)
    shape.lineTo(1, -0.35)
    shape.lineTo(1.15, 0)
    shape.lineTo(0.9, 0.35)
    shape.lineTo(-0.9, 0.35)
    shape.lineTo(-1.15, 0)
    shape.closePath()
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 })
    g.rotateX(Math.PI / 2)
    return g
  }, [])

  return (
    <mesh geometry={geom} position={[0, 0.42, 0]} rotation={[0, 0, 0]}>
      <meshStandardMaterial color="#f5a623" roughness={0.4} metalness={0.05} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Lettuce() {
  const pieces = useMemo(() => {
    const p: { pos: [number, number, number]; rot: number; sc: number }[] = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.2
      const r = 0.6 + Math.random() * 0.25
      p.push({
        pos: [Math.cos(angle) * r, 0.52 + Math.random() * 0.08, Math.sin(angle) * r],
        rot: angle + Math.random() * 0.3,
        sc: 0.7 + Math.random() * 0.6,
      })
    }
    return p
  }, [])

  return (
    <group>
      {pieces.map((p, i) => (
        <group key={i} position={p.pos} rotation={[Math.random() * 0.3, p.rot, Math.random() * 0.4]} scale={p.sc}>
          <mesh>
            <sphereGeometry args={[0.15, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#2d5a1e" roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function BottomBun() {
  const geom = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 48, 32)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      if (y > 0) pos.setY(i, 0)
      pos.setY(i, y * 0.5)
      pos.setX(i, x + Math.sin(y * 3) * 0.015)
      pos.setZ(i, z + Math.cos(y * 3) * 0.015)
    }
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geom} position={[0, 0.05, 0]} scale={[1.15, 0.65, 1.15]} rotation={[0, 0, 0]}>
      <meshStandardMaterial color="#b06c30" roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

function FireParticles() {
  const count = 200
  const meshRef = useRef<THREE.Points>(null)

  const { positions, data } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const d = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.3 + Math.random() * 0.5
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = -Math.random() * 0.5
      pos[i * 3 + 2] = Math.sin(a) * r
      d[i * 3] = (Math.random() - 0.5) * 0.004
      d[i * 3 + 1] = 0.01 + Math.random() * 0.06
      d[i * 3 + 2] = (Math.random() - 0.5) * 0.004
    }
    return { positions: pos, data: d }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const geom = meshRef.current.geometry
    const pos = geom.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const idx = i * 3
      pos[idx] += data[idx] + Math.sin(Date.now() * 0.01 + i) * 0.002
      pos[idx + 1] += data[idx + 1]
      pos[idx + 2] += data[idx + 2] + Math.cos(Date.now() * 0.01 + i) * 0.002
      if (pos[idx + 1] > 2.5) {
        const a = Math.random() * Math.PI * 2
        const r = 0.3 + Math.random() * 0.5
        pos[idx] = Math.cos(a) * r
        pos[idx + 1] = -0.2
        pos[idx + 2] = Math.sin(a) * r
      }
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef} position={[0, 0.8, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ff6600" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function FireInner() {
  const count = 100
  const meshRef = useRef<THREE.Points>(null)

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.1 + Math.random() * 0.15
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = -0.3 + Math.random()
      pos[i * 3 + 2] = Math.sin(a) * r
      spd[i] = 0.02 + Math.random() * 0.08
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const geom = meshRef.current.geometry
    const pos = geom.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i]
      if (pos[i * 3 + 1] > 1.5) {
        const a = Math.random() * Math.PI * 2
        const r = 0.1 + Math.random() * 0.15
        pos[i * 3] = Math.cos(a) * r
        pos[i * 3 + 1] = -0.1 + Math.random() * 0.3
        pos[i * 3 + 2] = Math.sin(a) * r
        speeds[i] = 0.02 + Math.random() * 0.08
      }
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef} position={[0, 0.6, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffbb33" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function SmokeParticles() {
  const count = 60
  const meshRef = useRef<THREE.Points>(null)

  const { positions, data } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const d = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.3 + Math.random() * 0.6
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = 1 + Math.random() * 1.5
      pos[i * 3 + 2] = Math.sin(a) * r
      d[i * 4] = (Math.random() - 0.5) * 0.003
      d[i * 4 + 1] = 0.003 + Math.random() * 0.012
      d[i * 4 + 2] = (Math.random() - 0.5) * 0.003
      d[i * 4 + 3] = Math.random()
    }
    return { positions: pos, data: d }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const geom = meshRef.current.geometry
    const pos = geom.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const idx = i * 3
      pos[idx] += data[i * 4]
      pos[idx + 1] += data[i * 4 + 1]
      pos[idx + 2] += data[i * 4 + 2]
      if (pos[idx + 1] > 4) {
        const a = Math.random() * Math.PI * 2
        const r = 0.3 + Math.random() * 0.6
        pos[idx] = Math.cos(a) * r
        pos[idx + 1] = 1
        pos[idx + 2] = Math.sin(a) * r
      }
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef} position={[0, 0.3, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#333333" transparent opacity={0.35} blending={THREE.NormalBlending} depthWrite={false} />
    </points>
  )
}

function FireLights() {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.intensity = 2 + Math.sin(t * 8) * 0.5 + Math.sin(t * 13) * 0.3
  })
  return (
    <>
      <pointLight ref={ref} position={[0, 0.8, 0.5]} color="#ff6600" intensity={2} distance={5} />
      <pointLight position={[0, 0.5, -0.3]} color="#ffaa00" intensity={1.5} distance={4} />
    </>
  )
}

function BurgerScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.position.y = -0.3 + Math.sin(t * 0.8) * 0.1
  })

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <TopBun />
      <SesameSeeds />
      <Lettuce />
      <Cheese />
      <Patty />
      <BottomBun />
    </group>
  )
}

export function HeroFlame() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0.8, 5], fov: 40 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[2, 3, 2]} intensity={0.6} color="#ffffff" />
        <FireLights />
        <BurgerScene />
        <FireParticles />
        <FireInner />
        <SmokeParticles />
      </Canvas>
    </div>
  )
}
