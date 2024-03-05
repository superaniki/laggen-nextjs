
import { PassThrough } from "stream";
import * as PImage from "pureimage";
import { BarrelDetails, StaveCurveConfigDetails } from "@prisma/client";

import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import { PaperSizes } from "@/common/constants";
import { Paper } from "@/common/enums";
import { drawInfoTextCTX, drawRulerCTX, drawStaveCurveCTX } from "@/common/api-utils";

export async function POST(request: Request) {

  const data: any = await request.json()
  const config = data.staveCurveConfig as StaveCurveConfigWithData;
  const barrelDetails = data.barrelDetails as BarrelDetails;
  const configDetailsDataArray: StaveCurveConfigDetails[] = config.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));
  const { height, angle, topDiameter, staveLength, bottomDiameter } = { ...barrelDetails };

  if (configDetails === undefined)
    return;

  const paperHeight = PaperSizes[config.defaultPaperType as Paper].height;
  const paperWidth = PaperSizes[config.defaultPaperType as Paper].width;
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

  let staveTemplateInfoText = "Height: " + height + "  Top diameter: " + topDiameter + "  Bottom diameter: " + bottomDiameter +
    "  Stave length: " + staveLength + "  Angle: " + angle;

  drawStaveCurveCTX(ctx, config.defaultPaperType as Paper, barrelDetails, config)
  drawInfoTextCTX(ctx, staveTemplateInfoText, -90, -paperHeight + 23, margins + 4,)
  drawRulerCTX(ctx, 10, margins, paperHeight - margins + 5, 6, 0, 10);

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

