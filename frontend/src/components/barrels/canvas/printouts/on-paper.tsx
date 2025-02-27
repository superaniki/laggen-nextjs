import { Layer, Rect, Stage, Text } from "react-konva";
import StaveCurve from "./types/stave-curve";
import StaveFront from "./types/stave-front";
import StaveEnds from "./types/stave-end";
import BarrelSide from "./types/barrel-side";
import Ruler from "../commons/ruler";
import useEditStore from "@/store/edit-store";
import useBarrelStore from "@/store/barrel-store";
import usePaperSize from "@/hooks/usePaperSize";
import { StaveTool } from "@/common/enums";
import { getConfigDetails, paperSizeWithRotation } from "@/common/utils";

export default function OnPaper({ scale = 2.4 }: { scale?: number }) {
  const { details: barrelDetails, staveCurveConfig, staveFrontConfig, staveEndConfig } = useBarrelStore()
  const { height, topDiameter, staveLength, angle, bottomDiameter } = { ...barrelDetails };
  const { staveToolState: tool } = useEditStore();
  const paperState = usePaperSize();
  const cross = false;

  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig)
    return <></>

  const configDetails = getConfigDetails(tool, staveCurveConfig, staveFrontConfig, staveEndConfig);
  if (configDetails === undefined)
    return <></>;
  const { height: paperHeight, width: paperWidth } = paperSizeWithRotation(configDetails.rotatePaper, paperState);
  //console.log("paperheight" + height);

  // const scale = 2.4; //f.d printScale 1.8
  const margins = 15;

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  if (paperWidth == 0)
    return

  return <Stage width={paperWidth * scale} height={paperHeight * scale} >
    <Layer scale={{ x: scale, y: scale }}>
      <Rect fill={"white"} x={-5000} y={-5000} width={10000} height={10000} />

      {tool === StaveTool.Curve &&
        <StaveCurve cross={cross} scale={1} barrelDetails={barrelDetails} config={staveCurveConfig} />
      }
      {tool === StaveTool.Front &&
        <StaveFront config={staveFrontConfig} x={paperWidth * 0.5} y={margins} barrelDetails={barrelDetails} />
      }
      {tool === StaveTool.End &&
        <StaveEnds config={staveEndConfig} x={paperWidth * 0.5} y={paperHeight} {...barrelDetails} />
      }

      <BarrelSide inColor={false} x={paperWidth * 1 - margins * 1} y={paperHeight * 1 - margins * 1}
        barrelDetails={barrelDetails} thickStroke={true} scale={0.07} />
      <Ruler scale={10} y={paperHeight - margins + 5} x={margins - 15} xLength={6} yLength={0} margin={10} />
      <Text x={margins} rotation={270} y={paperHeight - 25} text={staveTemplateInfoText} fontFamily="courier" fontSize={3} fill={"black"} />
      <Text direction="ltr" x={10} y={10} text={barrelDetails.name} fontFamily="courier" fontSize={4} fill={"black"} align="left" />

    </Layer>
  </Stage>

}

