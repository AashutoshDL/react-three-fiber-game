import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Character = (props) => {
  const group = useRef();
  const keysPressed = useRef({});
  const [position, setPosition] = useState({ x: 0, z: 0 });
  
  // Load model and animations
  const { scene, animations } = useGLTF('/models/businessman.glb');
  const { actions } = useAnimations(animations, group);
  const currentAction = useRef(null);
  
  // Play a specific animation if not already playing
  const playAnimation = (name) => {
    if (!actions || !actions[name]) return;
    
    if (currentAction.current !== name) {
      if (currentAction.current && actions[currentAction.current]) {
        actions[currentAction.current].fadeOut(0.2);
      }
      
      actions[name].reset().fadeIn(0.2).play();
      currentAction.current = name;
    }
  };
  
  // Keyboard input tracking - fixed to detect arrow keys properly
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Movement and animation control
  useFrame(() => {
    let newX = position.x;
    let newZ = position.z;
    
    // Fixed key detection for arrow keys
    const forward = keysPressed.current['ArrowUp'];
    const backward = keysPressed.current['ArrowDown'];
    const left = keysPressed.current['ArrowLeft'];
    const right = keysPressed.current['ArrowRight'];
    
    const movementSpeed = 0.1;
    const direction = new THREE.Vector3(0, 0, 0);
    
    // Corrected movement directions
    if (forward) direction.z = 1;  // Forward is negative Z in Three.js
    if (backward) direction.z -= 1; // Backward is positive Z
    if (left) direction.x += 1;     // Left is negative X
    if (right) direction.x -= 1;    // Right is positive X
    
    // Only normalize if there's actual movement
    if (direction.length() > 0) {
      direction.normalize();
      
      // Apply movement
      newX += direction.x * movementSpeed;
      newZ += direction.z * movementSpeed;
      
      // Calculate rotation angle based on movement direction
      const angle = Math.atan2(direction.x, direction.z); // Note the negative Z for correct orientation
      
      // Smooth rotation using lerp (linear interpolation)
      if (group.current) {
        group.current.rotation.y = THREE.MathUtils.lerp(
          group.current.rotation.y, 
          angle, 
          0.1  // The factor controls the smoothness of the rotation (0.1 is a good starting point)
        );
      }
      
      setPosition({ x: newX, z: newZ });
    }
    
    // Update position
    if (group.current) {
      group.current.position.x = newX;
      group.current.position.z = newZ;
    }
    
    // Select animation based on movement
    if (direction.length() > 0) {
      // Determine which animation to play based on primary movement direction
      if (Math.abs(direction.x) > Math.abs(direction.z)) {
        // Moving primarily left or right
        if (direction.x < 0) {
          playAnimation('CharacterArmature|Run');
        } else {
          playAnimation('CharacterArmature|Run');
        }
      } else {
        // Moving primarily forward or backward
        if (direction.z < 0) {
          playAnimation('CharacterArmature|Run');
        } else {
          playAnimation('CharacterArmature|Run');
        }
      }
    } else {
      // Not moving, play idle animation
      playAnimation('CharacterArmature|Idle');
    }
  });
  
  return (
    <group ref={group} {...props}>
      <primitive object={scene} scale={2.5} />
    </group>
  );
};

export default Character;
