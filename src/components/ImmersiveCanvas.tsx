import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, TorusKnot, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Knot({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((state) => {
    if (reduced || !ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.16
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.18
  })
  return (
    <group ref={ref}>
      <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.35} floatIntensity={reduced ? 0 : 0.6}>
        <TorusKnot args={[1, 0.32, 220, 32]}>
          <MeshDistortMaterial
            color="#3a3550"
            emissive="#9a8fd6"
            emissiveIntensity={0.25}
            roughness={0.18}
            metalness={0.85}
            distort={reduced ? 0.08 : 0.28}
            speed={reduced ? 0 : 1.2}
          />
        </TorusKnot>
      </Float>
    </group>
  )
}

export default function ImmersiveCanvas({ active = true }: { active?: boolean }) {
  const reduced = prefersReduced()
  const frameloop = reduced ? 'demand' : active ? 'always' : 'never'
  return (
    <Canvas frameloop={frameloop} dpr={[1, 1.6]} camera={{ position: [0, 0, 4.2], fov: 42 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#d6a86a" />
      <pointLight position={[-5, -2, 2]} intensity={34} color="#9a8fd6" />
      <pointLight position={[0, 2, -4]} intensity={20} color="#7fb1c4" />
      <Knot reduced={reduced} />
    </Canvas>
  )
}
