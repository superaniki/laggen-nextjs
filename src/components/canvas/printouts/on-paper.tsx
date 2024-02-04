import { Layer, Rect, Stage, Text } from "react-konva";
import PlaningTool from "./types/planing-tool";
import StaveFront from "./types/stave-front";
import StaveEnds from "./types/stave-end";
import BarrelSide from "./types/barrel-side";
import Ruler from "../commons/ruler";
import { useState } from "react";
import { Barrel } from "@prisma/client";


interface OnPaperProps {
  barrel: Barrel
  tool: BarrelTool
  paperType?: Paper
}


export enum Paper {
  A3,
  A4,
}

export enum BarrelTool {
  PlaningTool,
  StaveFront,
  StaveEnds
}

export default function OnPaper({ barrel, tool = BarrelTool.PlaningTool, paperType = Paper.A4 }: OnPaperProps) {
  const { height, topDiameter, staveLength, angle, bottomDiameter } = { ...barrel };
  const [staveTemplateRotation, setStaveTemplateRotation] = useState(false);
  const cross = false;
  const visible = true;
  let paperSize = { width: 0, height: 0 }

  switch (paperType) {
    case Paper.A3:
      paperSize = { width: 297, height: 420 }
      break;
    case Paper.A4:
      paperSize = { width: 210, height: 297 }
      break;
    default:
      paperSize = { width: 210, height: 297 }
  }
  // Fixa så att val av papersize ger mig rätt mått
  console.log("paperSize:", paperSize)


  const scale = 2.5; //f.d printScale 1.8
  const margins = 15;
  let maxArea = { width: paperSize.width - margins, height: paperSize.height - margins };

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  let page = 0;


  return <Stage visible={visible} /*ref={printRef}*/ width={paperSize.width * scale} height={paperSize.height * scale}>
    <Layer >
      <Rect fill={"white"} x={-5000} y={-5000} width={10000} height={10000} />

      {tool === BarrelTool.PlaningTool &&
        <PlaningTool cross={cross} scale={scale} x={30 * scale} y={270 * scale} barrel={barrel} />
      }
      {tool === BarrelTool.StaveFront &&
        <StaveFront onClick={() => setStaveTemplateRotation(!staveTemplateRotation)} maxArea={maxArea} rotate={staveTemplateRotation} x={paperSize.width * scale * 0.5} y={margins * scale} barrel={barrel} scale={scale} />
      }
      {tool === BarrelTool.StaveEnds &&
        <StaveEnds scale={scale} x={paperSize.width * scale * 0.5} y={paperSize.height} {...barrel} />
      }

      <BarrelSide visible={true} inColor={false} x={paperSize.width * scale - margins * scale} y={paperSize.height * scale - margins * scale}
        {...barrel} thickStroke={true} scale={0.07 * scale} />
      <Ruler scale={scale * 10} y={paperSize.height * scale - margins * scale} x={margins * scale - 15} xLength={6} yLength={0} />
      <Text x={margins * scale} rotation={270} y={paperSize.height * scale - 25 * scale} text={staveTemplateInfoText} fontFamily="courier" fontSize={3 * scale} fill={"black"} />
    </Layer>
  </Stage>

}