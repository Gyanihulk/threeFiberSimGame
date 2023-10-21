import { useGLTF } from "@react-three/drei";
import React, { useMemo } from "react";
import { mapAtom } from "./SocketManager";
import { SkeletonUtils } from "three-stdlib";
import { useAtom } from "jotai";

const Item = ({ item }) => {
  const { name, gridPosition, size ,rotation} = item;
  const [map] = useAtom(mapAtom);

  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width=rotation===1||rotation===3?size[1]:size[0]
  const height=rotation===1||rotation===3?size[0]:size[1]
  return (
    <primitive
      object={clone}
      position={[
        width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
        0,
        height / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
      ]}
      rotation-y={((rotation || 0) * Math.PI) / 2}
    />
  );
};

export default Item;
