import { useState } from "react";
import { Rect } from "react-konva";
import { round } from "./barrel-math";

export function SelectionRect({ pos, size }: { pos: { x: number, y: number }, size: { x: number, y: number } }) {

  const [isHovered, setIsHovered] = useState(false);

  return <Rect onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} stroke={"#FFAAAA"} strokeWidth={2} cornerRadius={0} strokeEnabled={isHovered}
    x={round(pos.x)} y={round(pos.y)} width={round(size.x)} height={round(size.y)} />
}