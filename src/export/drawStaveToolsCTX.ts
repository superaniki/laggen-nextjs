import { BarrelExportData } from "@/app/api/barrels/export/route";
import { drawBarrelSideCTX, drawInfoTextCTX, drawRulerCTX, drawStaveCurveCTX, drawStaveEndsCTX, drawStaveFrontCTX } from "@/export/toolTemplatesCTX";
import { PaperSizes } from "@/common/constants";
import { Paper, StaveTool } from "@/common/enums";
import { StaveCurveConfigDetails, StaveEndConfigDetails, StaveFrontConfigDetails } from "@prisma/client";
import * as PImage from "pureimage";

export function createStaveToolsPImage(barrelExportData : BarrelExportData){
  const {barrelDetails, staveToolState, staveCurveConfig, staveEndConfig, staveFrontConfig} = {...barrelExportData}

  let config: any;
  let configDetailsDataArray: StaveCurveConfigDetails[] | StaveEndConfigDetails[] | StaveFrontConfigDetails[];
  let configDetails: any;
  switch (staveToolState) {
    case StaveTool.Curve:
      config = staveCurveConfig;
      configDetailsDataArray = config.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
    case StaveTool.End:
      config = staveEndConfig;
      configDetailsDataArray = config.configDetails;
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
    case StaveTool.Front:
      config = staveFrontConfig;
      configDetailsDataArray = config.configDetails as StaveFrontConfigDetails[];
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
  }

  const { height, angle, topDiameter, staveLength, bottomDiameter } = { ...barrelDetails };

  if (configDetails === undefined)
    return;

  let paperHeight = PaperSizes[config.defaultPaperType as Paper].height;
  let paperWidth = PaperSizes[config.defaultPaperType as Paper].width;

  if (configDetails.rotatePaper) {
    paperWidth = PaperSizes[config.defaultPaperType as Paper].height;
    paperHeight = PaperSizes[config.defaultPaperType as Paper].width;
  }

  const scale = 16;
  const bitmap = PImage.make(paperWidth * scale, paperHeight * scale);

  const ctx = bitmap.getContext('2d');
  ctx.scale(scale, scale);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, paperWidth, paperHeight);

  var fnt = PImage.registerFont(
    "./src/fonts/LiberationSans-Regular.ttf",
    "Liberation",
  );
  fnt.loadSync();
  const margins = 15;
  const rulerMargin = 10

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  switch (staveToolState) {
    case StaveTool.Curve:
      drawStaveCurveCTX(ctx, config.defaultPaperType as Paper, barrelDetails, config)
      break;
    case StaveTool.End:
      drawStaveEndsCTX(ctx, paperWidth * 0.5, paperHeight, barrelDetails, config, config.defaultPaperType as Paper)
      break;
    case StaveTool.Front:
      drawStaveFrontCTX(ctx, paperWidth * 0.5, margins, barrelDetails, config, config.defaultPaperType as Paper)
      break;
  }

  drawInfoTextCTX(ctx, staveTemplateInfoText, -90, -paperHeight + 23, margins + 4)
  drawInfoTextCTX(ctx, barrelDetails.name, 0, 10, 10)
  drawRulerCTX(ctx, 10, rulerMargin, paperHeight - (rulerMargin * 2), 6, 0, rulerMargin);
  drawBarrelSideCTX(ctx, paperWidth - margins, paperHeight - margins, barrelDetails, 0.07);

  return bitmap;
}