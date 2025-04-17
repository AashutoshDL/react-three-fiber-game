import React, { useEffect, useRef } from "react";
import * as CANNON from "cannon-es";
import { useThree, useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { useAppContext } from "../context/AppContext";

const Floor = ({
  position = [0, -0.3, 0],
  rotation = [-Math.PI / 2, 0, 0],
  size = [100, 100], // Width and length of the floor
}) => {
  const { setFloorPosition, setFloorBounds } = useAppContext(); // Add a setter for the bounds
  const { scene } = useThree();
  const floorRef = useRef();
  const physicsBodyRef = useRef();

  useEffect(() => {
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const groundMaterial = new CANNON.Material("groundMaterial");
    groundMaterial.friction = 0.25;
    groundMaterial.restitution = 0.25;

    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    groundBody.addShape(groundShape);
    groundBody.position.set(...position);
    groundBody.quaternion.setFromEuler(...rotation);
    world.addBody(groundBody);

    physicsBodyRef.current = groundBody;

    // Calculate the perimeter of the floor
    const [width, length] = size;
    const bounds = {
      xMin: position[0] - width / 2,
      xMax: position[0] + width / 2,
      zMin: position[2] - length / 2,
      zMax: position[2] + length / 2,
    };

    // Set the floor bounds in the context
    setFloorBounds(bounds);

    return () => {
      world.removeBody(groundBody);
    };
  }, [position, rotation, size, setFloorBounds]);

  useFrame(() => {
    if (physicsBodyRef.current && floorRef.current) {
      floorRef.current.position.copy(physicsBodyRef.current.position);
      floorRef.current.quaternion.copy(physicsBodyRef.current.quaternion);

      // Update the floor position in the context
      setFloorPosition([
        floorRef.current.position.x,
        floorRef.current.position.y,
        floorRef.current.position.z,
      ]);
    }
  });

  return (
    <Plane ref={floorRef} args={size} position={position} rotation={rotation}>
      <meshPhongMaterial color="lightgreen" receiveShadow />
    </Plane>
  );
};

export default Floor;