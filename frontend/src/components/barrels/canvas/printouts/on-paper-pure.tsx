import { Layer, Rect, Stage, Text, Line, Group } from "react-konva";

export default function OnPaperPure() {
  return <Stage width={400} height={600}>
    <Layer >
      <Rect fill={"pink"} x={-5000} y={-5000} width={10000} height={10000} />
      <Text x={20} rotation={15} y={20} text={"Haj på dajj!"} fontFamily="courier" fontSize={10} fill={"black"} />
    </Layer>
  </Stage>

}

