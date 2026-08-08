import { Suspense, lazy } from 'react'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 70

function EmberParticles() {
  const meshRef = useRef<THREE.Points>(null)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
      vel[i] = 0.002 + Math.random() * 0.008
    }
    return { positions: pos, velocities: vel }
  }, [])

  useFrame(() => {
    if (!meshRef.current || prefersReducedMotion.current) return
    const geom = meshRef.current.geometry
    const pos = geom.attributes.position.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += velocities[i]
      if (pos[i * 3 + 1] > 8) {
        pos[i * 3 + 1] = -4
        pos[i * 3] = (Math.random() - 0.5) * 10
      }
    }
    geom.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#f47b20"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function FallbackBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: 'radial-gradient(ellipse at bottom, #e6390015 0%, transparent 60%), radial-gradient(ellipse at top, #f47b2010 0%, transparent 40%)',
      }}
    />
  )
}

export function EmberBackground() {
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) return <FallbackBackground />

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0} />
        <EmberParticles />
      </Canvas>
      <FallbackBackground />
    </div>
  )
}
