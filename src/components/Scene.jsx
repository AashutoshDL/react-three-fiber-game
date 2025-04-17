import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// import { Physics } from "@react-three/rapier";
import Car from "./Car";
import Floor from "./Floor";
import Plane from "./Plane";
import Character from "./Character";

const Scene = () => {
  return (
      <Canvas camera={{ position: [10, 25, -5], fov:60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {/* <Physics> */}
        <Car />
        <Floor />
        <Plane />
        <Character />
      {/* </Physics> */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
      />
    </Canvas>
  )
}

export default Scene
