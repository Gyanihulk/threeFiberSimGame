import {
  ContactShadows,
  Environment,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import { Man } from "./Man";
import { useAtom } from "jotai";
import { charactersAtom, mapAtom, socket, userAtom } from "./SocketManager";
import { useState } from "react";
import * as THREE from "three";
import Item from "./Item";
import { useThree } from "@react-three/fiber";
import { useGrid } from "../hooks/useGrid";
export const Experience = () => {
  const [characters] = useAtom(charactersAtom);
  const [onFloor, setOnFloor] = useState(false);
  const [map] = useAtom(mapAtom);
  console.log(map, "from experiecne");
  useCursor(onFloor);

  const scene=useThree((state)=>state.scene)

  const[user]=useAtom(userAtom);
const {vector3ToGrid,gridToVector3}=useGrid()
  const onCharacterMove=(e)=>{
    const character=scene.getObjectByName(`character-${user}`);
    if(!character){
      return
    }
    socket.emit("move",vector3ToGrid(character.position),vector3ToGrid(e.point))
  }
  return (
    <>
      <Environment path="/hdri/" files="venice_sunset_1k.hdr" />
      {/* <ambientLight intensity={0.5} /> */}
      <OrbitControls />

      {map &&
        map?.items.map((item, idx) => (
          <Item key={`${item.name}-${idx}`} item={item} />
        ))}
      <ContactShadows blur={2} />
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) => onCharacterMove(e)}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0]/2}
        position-z={map.size[1]/2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {characters.map((character) => (
        <Man
          key={character.id}
          id={character.id}
          position={
            gridToVector3(character.position)
          }
          path={character.path}
          hairColor={character.hairColor}
          topColor={character.topColor}
          bottomColor={character.bottomColor}
        />
      ))}
    </>
  );
};
