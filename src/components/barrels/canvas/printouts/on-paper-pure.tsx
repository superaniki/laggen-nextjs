import { Layer, Rect, Stage, Text, Line, Group } from "react-konva";

/*
import BarrelSide from "./types/barrel-side";
import Ruler from "../commons/ruler";
import useEditStore, { Paper, StaveTool } from "@/store/edit-store";
import useBarrelStore from "@/store/barrel-store";
import StaveCurvePure from "./types/stave-curve-pure";
import StaveEndsPure from "./types/stave-end-pure";
import StaveFrontPure from "./types/stave-front-pure";

const PaperSizes = {
  [Paper.A3]: { width: 297, height: 420 },
  [Paper.A4]: { width: 210, height: 297 }
}
*/
export default function OnPaperPure() {
  return <Stage width={400} height={600}>
    <Layer >
      <Rect fill={"pink"} x={-5000} y={-5000} width={10000} height={10000} />
      <Text x={20} rotation={15} y={20} text={"Haj på dajj!"} fontFamily="courier" fontSize={10} fill={"black"} />
    </Layer>
  </Stage>

  /*
  const { details: barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore()
  const { height, topDiameter, staveLength, angle, bottomDiameter } = { ...barrelDetails };
  const { staveToolState: tool } = useEditStore();

  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig)
    return <></>

  let configDetails = null;
  let configDetailsDataArray = null;
  let paperSize = null;
  switch (tool) {
    case StaveTool.Curve:
      configDetailsDataArray = staveCurveConfig.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === staveCurveConfig.defaultPaperType));
      paperSize = staveCurveConfig?.defaultPaperType as Paper;

      break;
    case StaveTool.Front:
      configDetailsDataArray = staveFrontConfig.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === staveFrontConfig.defaultPaperType));
      paperSize = staveFrontConfig?.defaultPaperType as Paper;

      break;
    case StaveTool.End:
      configDetailsDataArray = staveEndConfig.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === staveEndConfig.defaultPaperType));
      paperSize = staveEndConfig?.defaultPaperType as Paper;
      break;
  }

  if (configDetails === undefined)
    return <></>;

  let paperWidth = PaperSizes[paperSize].width;
  let paperHeight = PaperSizes[paperSize].height;
  if (configDetails.rotatePaper) {
    paperWidth = PaperSizes[paperSize].height;
    paperHeight = PaperSizes[paperSize].width;
  }

  const scale = 2.4; //f.d printScale 1.8
  const margins = 15;

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  return <Stage width={paperWidth * scale} height={paperHeight * scale}>
    <Layer >
      <Rect fill={"white"} x={-5000} y={-5000} width={10000} height={10000} />

      {tool === StaveTool.Curve &&
        <StaveCurvePure paperState={paperSize} scale={scale} barrelDetails={barrelDetails} config={staveCurveConfig} />
      }
      {tool === StaveTool.Front &&
        <StaveFrontPure paperState={paperSize} config={staveFrontConfig} x={paperWidth * scale * 0.5} barrelDetails={barrelDetails} scale={scale} />
      }
      {tool === StaveTool.End &&
        <StaveEndsPure paperState={paperSize} config={staveEndConfig} scale={scale} x={paperWidth * scale * 0.5} y={paperHeight} {...barrelDetails} />
      }

      <BarrelSide visible={true} inColor={false} x={paperWidth * scale - margins * scale} y={paperHeight * scale - margins * scale}
        {...barrelDetails} thickStroke={true} scale={0.07 * scale} />
      <Ruler scale={scale * 10} y={paperHeight * scale - margins * scale} x={margins * scale - 15} xLength={6} yLength={0} />
      <Text x={margins * scale} rotation={270} y={paperHeight * scale - 25 * scale} text={staveTemplateInfoText} fontFamily="courier" fontSize={3 * scale} fill={"black"} />
    </Layer>
  </Stage>
  */

}

