import { Layer, Rect, Stage, Text } from "react-konva";
import StaveCurve from "./types/stave-curve";
import StaveFront from "./types/stave-front";
import StaveEnds from "./types/stave-end";
import BarrelSide from "./types/barrel-side";
import Ruler from "../commons/ruler";
import { useState } from "react";
import { KonvaEventObject } from "konva/lib/Node";
import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import useEditStore, { Paper, StaveTool } from "@/components/barrels/edit-store";
import useBarrelStore from "@/components/barrels/barrel-store";
import usePaperSize from "@/components/barrels/usePaperSize";

interface OnPaperProps {
  tool: StaveTool
}

const PaperSizes = {
  [Paper.A3]: { width: 297, height: 420 },
  [Paper.A4]: { width: 210, height: 297 }
}

export default function OnPaper({ tool }: OnPaperProps) {
  const { details: barrelDetails, staveCurveConfig } = useBarrelStore()
  const { height, topDiameter, staveLength, angle, bottomDiameter } = { ...barrelDetails };
  const [staveTemplateRotation, setStaveTemplateRotation] = useState(false);
  const cross = false;
  let paperSize = { width: 0, height: 0 }

  if (!barrelDetails || !staveCurveConfig)
    return <></>

  const paperState = staveCurveConfig.defaultPaperType as Paper; //usePaperSize();
  console.log("usePaperSize, paper:" + paperState);

  const configDetailsDataArray = staveCurveConfig.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === staveCurveConfig.defaultPaperType));

  if (configDetails === undefined)
    return <></>;

  let paperWidth = PaperSizes[paperState].width;
  let paperHeight = PaperSizes[paperState].height;
  if (configDetails.rotatePaper) {
    paperWidth = PaperSizes[paperState].height;
    paperHeight = PaperSizes[paperState].width;
  }

  const scale = 2.4; //f.d printScale 1.8
  const margins = 15;

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  return <Stage width={paperWidth * scale} height={paperHeight * scale}>
    <Layer >
      <Rect fill={"white"} x={-5000} y={-5000} width={10000} height={10000} />

      {tool === StaveTool.Curve &&
        <StaveCurve cross={cross} scale={scale} barrelDetails={barrelDetails} config={staveCurveConfig} />
      }
      {tool === StaveTool.Front &&
        <StaveFront onClick={() => setStaveTemplateRotation(!staveTemplateRotation)} x={paperSize.width * scale * 0.5} y={margins * scale} barrelDetails={barrelDetails} scale={scale} />
      }
      {tool === StaveTool.End &&
        <StaveEnds scale={scale} x={paperSize.width * scale * 0.5} y={paperSize.height} {...barrelDetails} />
      }

      <BarrelSide visible={true} inColor={false} x={paperSize.width * scale - margins * scale} y={paperSize.height * scale - margins * scale}
        {...barrelDetails} thickStroke={true} scale={0.07 * scale} />
      <Ruler scale={scale * 10} y={paperSize.height * scale - margins * scale} x={margins * scale - 15} xLength={6} yLength={0} />
      <Text x={margins * scale} rotation={270} y={paperSize.height * scale - 25 * scale} text={staveTemplateInfoText} fontFamily="courier" fontSize={3 * scale} fill={"black"} />
    </Layer>
  </Stage>

}

