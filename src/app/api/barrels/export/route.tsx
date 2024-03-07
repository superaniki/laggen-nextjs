
import { PassThrough } from "stream";
import * as PImage from "pureimage";
import { BarrelDetails, StaveCurveConfigDetails, StaveEndConfigDetails, StaveFrontConfigDetails } from "@prisma/client";

import { StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from "@/db/queries/barrels";
import { PaperSizes } from "@/common/constants";
import { Paper, StaveTool } from "@/common/enums";
import { drawBarrelSideCTX, drawInfoTextCTX, drawRulerCTX, drawStaveCurveCTX, drawStaveEndsCTX } from "@/common/api-utils";

export async function POST(request: Request) {
  const data: any = await request.json()
  const barrelDetails = data.barrelDetails as BarrelDetails;
  const staveToolState = data.staveToolState as StaveTool;

  let config: any;
  let configDetailsDataArray: StaveCurveConfigDetails[] | StaveEndConfigDetails[] | StaveFrontConfigDetails[];
  let configDetails: any;
  switch (staveToolState) {
    case StaveTool.Curve:
      config = data.staveCurveConfig as StaveCurveConfigWithData;
      configDetailsDataArray = config.configDetails as StaveCurveConfigDetails[];
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
    case StaveTool.End:
      config = data.staveEndConfig as StaveEndConfigWithData;
      configDetailsDataArray = config.configDetails as StaveEndConfigDetails[];
      configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
      break;
    case StaveTool.Front:
      config = data.staveFrontConfig as StaveFrontConfigWithData;
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

  const scale = 4;
  const img1 = PImage.make(paperWidth * scale, paperHeight * scale);

  const ctx = img1.getContext('2d');
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
      //drawStaveFrontCTX(ctx, config.defaultPaperType as Paper, barrelDetails, config)
      break;
  }

  drawInfoTextCTX(ctx, staveTemplateInfoText, -90, -paperHeight + 23, margins + 4,)
  drawRulerCTX(ctx, 10, rulerMargin, paperHeight - (rulerMargin * 2), 6, 0, rulerMargin);
  drawBarrelSideCTX(ctx, paperWidth - margins, paperHeight - margins, barrelDetails, 0.07);

  const passThroughStream = new PassThrough();
  PImage.encodePNGToStream(img1, passThroughStream); // skip await. dont return if scale is too large...
  // Collect the PNG data from the PassThrough stream
  const pngData: Buffer[] = [];
  passThroughStream.on("data", (chunk) => pngData.push(chunk));
  await new Promise<void>((resolve) => passThroughStream.on("end", resolve));

  // Concatenate the PNG data chunks into a single buffer
  const buf = Buffer.concat(pngData);

  // Return the PNG image data as the response
  return new Response(buf, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}

