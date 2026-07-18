import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Icosahedron } from "@react-three/drei";
import { Suspense } from "react";

export function FloatingScene() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#8B5CF6" />
        <directionalLight position={[-5, -3, 2]} intensity={0.8} color="#06B6D4" />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.4}>
            <Sphere args={[1.2, 64, 64]} position={[-2.2, 0.6, 0]}>
              <MeshDistortMaterial color="#6366F1" distort={0.45} speed={1.6} roughness={0.2} metalness={0.4} />
            </Sphere>
          </Float>
          <Float speed={1.1} rotationIntensity={1} floatIntensity={1.8}>
            <Icosahedron args={[0.9, 0]} position={[2.4, -0.4, -1]}>
              <meshStandardMaterial color="#06B6D4" roughness={0.15} metalness={0.6} />
            </Icosahedron>
          </Float>
          <Float speed={0.9} rotationIntensity={0.6} floatIntensity={1.2}>
            <Sphere args={[0.6, 48, 48]} position={[1.4, 1.6, -0.5]}>
              <MeshDistortMaterial color="#8B5CF6" distort={0.35} speed={2} roughness={0.25} metalness={0.5} />
            </Sphere>
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
