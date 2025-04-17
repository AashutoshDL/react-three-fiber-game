// CarScene.jsx
import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Car(props) {
  const carRef = useRef()
  const flWheel = useRef()
  const frWheel = useRef()
  const rlWheel = useRef()
  const rrWheel = useRef()

  const { nodes, materials } = useGLTF('/models/car.glb')

  const keysPressed = useRef({})
  const [rotationY, setRotationY] = useState(0)
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true
    }
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    let newSpeed = speed
    let newRotation = rotationY

    // Movement input
    if (keysPressed.current['w']) newSpeed += 0.02
    if (keysPressed.current['s']) newSpeed -= 0.02

    // Clamp speed
    newSpeed = Math.max(-0.5, Math.min(0.5, newSpeed))

    // Turning input
    if (keysPressed.current['a']) newRotation += 1.5 * delta
    if (keysPressed.current['d']) newRotation -= 1.5 * delta

    // Apply friction
    newSpeed *= 0.98

    // Move and rotate the car
    const car = carRef.current
    if (car) {
      car.position.x += Math.sin(newRotation) * newSpeed
      car.position.z += Math.cos(newRotation) * newSpeed
      car.rotation.y = newRotation
    }

    // Spin the wheels
    const wheelSpin = newSpeed * delta * 20
    flWheel.current.rotation.x -= wheelSpin
    frWheel.current.rotation.x -= wheelSpin
    rlWheel.current.rotation.x -= wheelSpin
    rrWheel.current.rotation.x -= wheelSpin

    setRotationY(newRotation)
    setSpeed(newSpeed)
  })

  return (
    <group ref={carRef} {...props} dispose={null} scale={3}>
      <group position={[-0.002, 0.757, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={100}>
        <mesh geometry={nodes.Headlights_1.geometry} material={materials.Body_paint} />
        <mesh geometry={nodes.Headlights_2.geometry} material={materials['Emission.001']} />
      </group>

      <mesh geometry={nodes.Bottom.geometry} material={materials.Miscs} position={[-0.002, 0.757, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={100} />

      <group position={[-0.002, 0.757, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={100}>
        <mesh geometry={nodes.Rear_bumper_1.geometry} material={materials.Miscs} />
        <mesh geometry={nodes.Rear_bumper_2.geometry} material={materials.Body_paint} />
        <mesh geometry={nodes.Rear_bumper_3.geometry} material={materials.Black_matte} />
        <mesh geometry={nodes.Rear_bumper_4.geometry} material={materials.Glass} />
      </group>

      <group ref={flWheel} position={[0.862, 0.306, 1.221]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={21.229}>
        <mesh geometry={nodes.FL_WHEEL_1.geometry} material={materials.Miscs} />
        <mesh geometry={nodes.FL_WHEEL_2.geometry} material={materials.Rims} />
      </group>

      <group ref={frWheel} position={[-0.863, 0.306, 1.221]} rotation={[Math.PI / 2, -1.571, 0]} scale={21.229}>
        <mesh geometry={nodes.FR_WHEEL_1.geometry} material={materials.Miscs} />
        <mesh geometry={nodes.FR_WHEEL_2.geometry} material={materials.Rims} />
      </group>

      <group ref={rlWheel} position={[0.862, 0.306, -1.228]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={21.229}>
        <mesh geometry={nodes.RL_WHEEL_1.geometry} material={materials.Miscs} />
        <mesh geometry={nodes.RL_WHEEL_2.geometry} material={materials.Rims} />
      </group>

      <group ref={rrWheel} position={[-0.863, 0.306, -1.228]} rotation={[Math.PI / 2, -1.571, 0]} scale={21.229}>
        <mesh geometry={nodes.RR_WHEEL_1.geometry} material={materials.Miscs} />
        <mesh geometry={nodes.RR_WHEEL_2.geometry} material={materials.Rims} />
      </group>

      <mesh geometry={nodes.Logos.geometry} material={materials.Miscs} position={[0.577, 0.81, -2.048]} rotation={[Math.PI, 0, Math.PI / 2]} scale={2.243} />
      <mesh geometry={nodes.Exhaust.geometry} material={materials.Miscs} position={[-0.002, 0.757, 0]} scale={6.052} />
      <mesh geometry={nodes.Plane013.geometry} material={materials.Body_paint} position={[-0.002, 0.757, 0]} rotation={[-Math.PI / 2, Math.PI / 2, 0]} scale={100} />
    </group>
  )
}

useGLTF.preload('/models/car.glb')