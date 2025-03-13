import { Layer, Rect, Stage, Text } from "react-konva";
import { StaveTool } from "@/common/enums";
import { Paper } from "@/common/types";
import { getConfigDetails, paperSizeWithRotation } from "@/common/utils";
import { StaveCurve } from "./stave-curve";
import { StaveFront } from "./stave-front";
import { StaveEnd } from "./stave-end";
import { BarrelSide } from "./barrel-side";
import { Ruler } from "@/canvas/primitives/ruler";

interface PrintoutCanvasProps {
  scale?: number;
  barrelDetails: BarrelDetails;
  staveCurveConfig: StaveCurveConfig;
  staveFrontConfig: StaveFrontConfig;
  staveEndConfig: StaveEndConfig;
  currentTool: StaveTool;
  paperSize: Paper;
}

// Move calculations outside component
const getStaveTemplateInfo = (barrelDetails: BarrelDetails) => {
  const { height, topDiameter, bottomDiameter, staveLength, angle } = barrelDetails;
  return `Height: ${height} Top diameter: ${topDiameter} Bottom diameter: ${bottomDiameter} Stave length: ${staveLength} Angle: ${angle}`;
};

export function PrintoutCanvas({
  scale = 2.4,
  barrelDetails,
  staveCurveConfig,
  staveFrontConfig,
  staveEndConfig,
  currentTool,
  paperSize,
}: PrintoutCanvasProps) {
  if (!barrelDetails || !staveCurveConfig || !staveFrontConfig || !staveEndConfig) {
    return null;
  }

  const configDetails = getConfigDetails(currentTool, staveCurveConfig, staveFrontConfig, staveEndConfig);
  if (!configDetails) {
    return null;
  }

  const { height: paperHeight, width: paperWidth } = paperSizeWithRotation(configDetails.rotatePaper, paperSize);
  if (paperWidth === 0) {
    return null;
  }

  const margins = 15;
  const staveTemplateInfoText = getStaveTemplateInfo(barrelDetails);

  return (
    <Stage width={paperWidth * scale} height={paperHeight * scale}>
      <Layer scale={{ x: scale, y: scale }}>
        <Rect 
          fill="white" 
          x={-5000} 
          y={-5000} 
          width={10000} 
          height={10000} 
        />

        {currentTool === StaveTool.Curve && (
          <StaveCurve
            cross={false}
            scale={1}
            barrelDetails={barrelDetails}
            config={staveCurveConfig}
          />
        )}

        {currentTool === StaveTool.Front && (
          <StaveFront
            config={staveFrontConfig}
            x={paperWidth * 0.5}
            y={margins}
            barrelDetails={barrelDetails}
          />
        )}

        {currentTool === StaveTool.End && (
          <StaveEnd
            config={staveEndConfig}
            x={paperWidth * 0.5}
            y={paperHeight}
            {...barrelDetails}
          />
        )}

        <BarrelSide
          inColor={false}
          x={paperWidth - margins}
          y={paperHeight - margins}
          barrelDetails={barrelDetails}
          thickStroke={true}
          scale={0.07}
        />

        <Ruler
          scale={10}
          y={paperHeight - margins + 5}
          x={margins - 15}
          xLength={6}
          yLength={0}
          margin={10}
        />

        <Text
          x={margins}
          rotation={270}
          y={paperHeight - 25}
          text={staveTemplateInfoText}
          fontFamily="courier"
          fontSize={3}
          fill="black"
        />

        <Text
          direction="ltr"
          x={10}
          y={10}
          text={barrelDetails.name}
          fontFamily="courier"
          fontSize={4}
          fill="black"
          align="left"
        />
      </Layer>
    </Stage>
  );
}