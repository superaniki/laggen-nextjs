import { Layer, Rect, Stage, Text } from "react-konva";
import StaveCurve from "./types/stave-curve";
import StaveFront from "./types/stave-front";
import StaveEnds from "./types/stave-end";
import BarrelSide from "./types/barrel-side";
import Ruler from "../commons/ruler";
import { useState } from "react";
import useEditStore, { Paper, StaveTool } from "@/store/edit-store";
import useBarrelStore from "@/store/barrel-store";
import usePaperSize from "@/components/hooks/usePaperSize";

const PaperSizes = {
  [Paper.A3]: { width: 297, height: 420 },
  [Paper.A4]: { width: 210, height: 297 }
}

export default function OnPaper() {
  const { details: barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore()
  const { height, topDiameter, staveLength, angle, bottomDiameter } = { ...barrelDetails };
  const [staveTemplateRotation, setStaveTemplateRotation] = useState(false);
  const { staveToolState: tool } = useEditStore();
  const paperState = usePaperSize();
  const cross = false;

  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig)
    return <></>

  console.log("usePaperSize, paper:" + paperState);

  let configDetails = null;
  let configDetailsDataArray = null;
  switch (tool) {
    case StaveTool.Curve:
      configDetailsDataArray = staveCurveConfig.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === staveCurveConfig.defaultPaperType));
      break;
    case StaveTool.Front:
      configDetailsDataArray = staveFrontConfig.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === staveCurveConfig.defaultPaperType));
      break;
    case StaveTool.End:
      configDetailsDataArray = staveEndConfig.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === staveEndConfig.defaultPaperType));
      break;
  }

  if (configDetails === undefined)
    return <></>;

  let paperWidth = PaperSizes[paperState].width;
  let paperHeight = PaperSizes[paperState].height;
  if (configDetails?.rotatePaper) {
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
        <StaveFront config={staveFrontConfig} onClick={() => setStaveTemplateRotation(!staveTemplateRotation)} x={paperWidth * scale * 0.5} y={margins * scale} barrelDetails={barrelDetails} scale={scale} />
      }
      {tool === StaveTool.End &&
        <StaveEnds config={staveEndConfig} scale={scale} x={paperWidth * scale * 0.5} y={paperHeight} {...barrelDetails} />
      }

      <BarrelSide visible={true} inColor={false} x={paperWidth * scale - margins * scale} y={paperHeight * scale - margins * scale}
        {...barrelDetails} thickStroke={true} scale={0.07 * scale} />
      <Ruler scale={scale * 10} y={paperHeight * scale - margins * scale} x={margins * scale - 15} xLength={6} yLength={0} />
      <Text x={margins * scale} rotation={270} y={paperHeight * scale - 25 * scale} text={staveTemplateInfoText} fontFamily="courier" fontSize={3 * scale} fill={"black"} />
    </Layer>
  </Stage>

}

