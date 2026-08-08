import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function FlameCore() {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)

  const geom = useMemo(() => new THREE.SphereGeometry(1, 32, 32), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05)
    groupRef.current.rotation.y += 0.003
    if (materialRef.current) {
      materialRef.current.opacity = 0.6 + Math.sin(t * 2) * 0.15
    }
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={geom} scale={1.05}>
        <meshBasicMaterial ref={materialRef} color="#e63900" transparent opacity={0.5} />
      </mesh>
      <mesh geometry={geom}>
        <meshBasicMaterial color="#f47b20" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  )
}

function FlameParticles() {
  const meshRef = useRef<THREE.Points>(null)
  const COUNT = 120

  const { positions, randoms } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const rnd = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.2 + Math.random() * 0.8
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      rnd[i] = Math.random()
    }
    return { positions: pos, randoms: rnd }
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const geom = meshRef.current.geometry
    const pos = geom.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      const idx = i * 3
      const r = 1.2 + randoms[i] * 0.8 + Math.sin(t * 3 + randoms[i] * 10) * 0.15
      const theta = Math.atan2(pos[idx + 2], pos[idx]) + 0.005 * randoms[i]
      const phi = Math.acos(pos[idx + 1] / r) + 0.003 * randoms[i]
      pos[idx] = r * Math.sin(phi) * Math.cos(theta)
      pos[idx + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[idx + 2] = r * Math.cos(phi)
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffb347" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

function RisingEmbers() {
  const meshRef = useRef<THREE.Points>(null)
  const COUNT = 40

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const spd = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3
      pos[i * 3 + 1] = -2 + Math.random() * 3
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3
      spd[i] = 0.01 + Math.random() * 0.03
    }
    return { positions: pos, speeds: spd }
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const geom = meshRef.current.geometry
    const pos = geom.attributes.position.array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] += speeds[i]
      if (pos[i * 3 + 1] > 4) {
        pos[i * 3 + 1] = -2
        pos[i * 3] = (Math.random() - 0.5) * 3
      }
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#e63900" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

export function HeroFlame() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0} />
        <FlameCore />
        <FlameParticles />
        <RisingEmbers />
      </Canvas>
    </div>
  )
}
