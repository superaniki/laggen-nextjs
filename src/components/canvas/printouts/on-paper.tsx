import { Layer, Rect, Stage, Text } from "react-konva";
import StaveCurve from "./types/stave-curve";
import StaveFront from "./types/stave-front";
import StaveEnds from "./types/stave-end";
import BarrelSide from "./types/barrel-side";
import Ruler from "../commons/ruler";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { BarrelDetails, StaveCurveConfig } from "@prisma/client";
import { BarrelWithData, StaveCurveConfigWithData } from "@/db/queries/barrels";

interface OnPaperProps {
  barrelDetails: BarrelDetails
  tool: BarrelTool
  paper: String
  staveCurveConfig: StaveCurveConfigWithData
}

export enum Paper {
  A3 = "A3",
  A4 = "A4"
}

export enum BarrelTool {
  StaveCurve,
  StaveFront,
  StaveEnd
}

export default function OnPaper({ barrelDetails, tool = BarrelTool.StaveCurve, paper, staveCurveConfig }: OnPaperProps) {
  const { height, topDiameter, staveLength, angle, bottomDiameter } = { ...barrelDetails };
  const [staveTemplateRotation, setStaveTemplateRotation] = useState(false);
  const cross = false;
  const visible = true;
  let paperSize = { width: 0, height: 0 }

  //const [config, setConfig] = useState(barrel.staveCurveConfig);

  switch (paper) {
    case "A3":
      paperSize = { width: 297, height: 420 }
      break;
    case "A4":
      paperSize = { width: 210, height: 297 }
      break;
    default:
      paperSize = { width: 210, height: 297 }
  }
  // Fixa så att val av papersize ger mig rätt mått
  console.log("paperSize:", paperSize)

  const scale = 2.5; //f.d printScale 1.8
  const margins = 15;
  //l et maxArea = { width: paperSize.width - margins, height: paperSize.height - margins };

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  function hasKeys(obj: Record<string, any>, keys: string[]): boolean {
    return keys.every(key => obj.hasOwnProperty(key));
  }

  function handleOnDragEnd(e: KonvaEventObject<MouseEvent>) {
    /*
    console.log("onDragEnd : " + e.target.id());
    console.log(e.target.getPosition());
    const id = e.target.id();
    type k = keyof ToolConfig;

    const newConfig = JSON.parse(JSON.stringify(config)) as ToolConfig;
    newConfig.staveCurve.config[paperType][id as "innerBottom" | "outerBottom"]
    newConfig.staveCurve.config[paperType]
    Object.keys

    //const newConfig = config.staveCurve.config[paperType];

    //setConfig({ ...config, staveCurve: { config: {[paperType] : { ...newConfig })
    */
  }

  function handleUpdate(updatedConfig: StaveCurveConfigWithData) {
    // setConfig(updatedConfig);
  }

  return <Stage onDragEnd={(e) => handleOnDragEnd(e)} visible={visible} /*ref={printRef}*/ width={paperSize.width * scale} height={paperSize.height * scale}>
    <Layer >
      <Rect fill={"white"} x={-5000} y={-5000} width={10000} height={10000} />

      {tool === BarrelTool.StaveCurve &&
        // <StaveCurve cross={cross} scale={scale} x={30 * scale} y={20 * scale} barrel={barrel} />
        <StaveCurve /*onUpdate={handleUpdate}*/ cross={cross} scale={scale} barrelDetails={barrelDetails} config={staveCurveConfig} />
      }
      {tool === BarrelTool.StaveFront &&
        <StaveFront onClick={() => setStaveTemplateRotation(!staveTemplateRotation)} /*maxArea={maxArea}*/ x={paperSize.width * scale * 0.5} y={margins * scale} barrelDetails={barrelDetails} scale={scale} />
      }
      {tool === BarrelTool.StaveEnd &&
        <StaveEnds scale={scale} x={paperSize.width * scale * 0.5} y={paperSize.height} {...barrelDetails} />
      }

      <BarrelSide visible={true} inColor={false} x={paperSize.width * scale - margins * scale} y={paperSize.height * scale - margins * scale}
        {...barrelDetails} thickStroke={true} scale={0.07 * scale} />
      <Ruler scale={scale * 10} y={paperSize.height * scale - margins * scale} x={margins * scale - 15} xLength={6} yLength={0} />
      <Text x={margins * scale} rotation={270} y={paperSize.height * scale - 25 * scale} text={staveTemplateInfoText} fontFamily="courier" fontSize={3 * scale} fill={"black"} />
    </Layer>
  </Stage>

}

