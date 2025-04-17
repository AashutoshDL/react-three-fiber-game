import React, { useEffect, useRef } from 'react'
import * as CANNON from 'cannon-es'
import { useThree, useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'

const Floor = ({ position = [0, -0.3, 0], rotation = [-Math.PI / 2, 0, 0], size = [100, 100] }) => {
  const { scene } = useThree()
  const floorRef = useRef()
  const physicsBodyRef = useRef()

  useEffect(() => {
    const world = new CANNON.World()
    world.gravity.set(0, -9.82, 0)

    const groundMaterial = new CANNON.Material('groundMaterial')
    groundMaterial.friction = 0.25
    groundMaterial.restitution = 0.25

    const groundShape = new CANNON.Plane()
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial })
    groundBody.addShape(groundShape)
    groundBody.position.set(...position)
    groundBody.quaternion.setFromEuler(...rotation)
    world.addBody(groundBody)

    physicsBodyRef.current = groundBody;

    return () => {
      world.removeBody(groundBody)
    }
  }, [position, rotation])

  useFrame(() => {
    if (physicsBodyRef.current && floorRef.current) {
      floorRef.current.position.copy(physicsBodyRef.current.position);
      floorRef.current.quaternion.copy(physicsBodyRef.current.quaternion);
    }
  });

  return (
    <Plane ref={floorRef} args={size} position={position} rotation={rotation}>
      <meshPhongMaterial color="lightgreen" receiveShadow />
    </Plane>
  )
}

export default Floor