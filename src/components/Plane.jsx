import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

const Plane = (props) => {
  const planeRef = useRef()
  const { scene } = useGLTF('/models/plane.glb')
  const keysPressed = useRef({})
  const [yPosition, setYPosition] = useState(0)
  const [zPosition, setZPosition] = useState(0)

  // Key press handling
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
    let newY = yPosition
    let newZ = zPosition

    // Vertical movement
    if (keysPressed.current['x']) newY += 0.05
    if (keysPressed.current['c']) newY -= 0.05

    // Forward/backward movement
    if (keysPressed.current['z']) newZ -= 0.1
    if (keysPressed.current['v']) newZ += 0.1

    // Optional clamps
    newY = Math.max(0, Math.min(50, newY))
    newZ = Math.max(-20, Math.min(20, newZ))

    setYPosition(newY)
    setZPosition(newZ)

    if (planeRef.current) {
      planeRef.current.position.y = newY
      planeRef.current.position.z = newZ
    }
  })

  return (
    <primitive ref={planeRef} object={scene} scale={15.5} {...props} position={[20,0,0]}/>
  )
}

export default Plane