
import { PassThrough } from "stream";
import * as PImage from "pureimage";
import { Barrel, BarrelDetails, StaveCurveConfig, StaveCurveConfigDetails } from "@prisma/client";

import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import { PaperSizes } from "@/common/constants";
import { Paper } from "@/common/enums";
import StaveCurveCTX from "@/common/api-utils";

export async function POST(request: Request) {

  const data: any = await request.json()
  const config = data.staveCurveConfig as StaveCurveConfigWithData;
  const barrelDetails = data.barrelDetails as BarrelDetails;
  const configDetailsDataArray: StaveCurveConfigDetails[] = config.configDetails;
  const configDetails = configDetailsDataArray.find(item => (item.paperType === config.defaultPaperType));

  if (configDetails === undefined)
    return;

  const height = PaperSizes[config.defaultPaperType as Paper].height;
  const width = PaperSizes[config.defaultPaperType as Paper].width;
  const scale = 4;
  const img1 = PImage.make(width * scale, height * scale);

  // Get canvas context
  const ctx = img1.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width * scale, height * scale);

  StaveCurveCTX(ctx, config.defaultPaperType as Paper, barrelDetails, config, scale)

  /*
   ctx.rotate(20 * Math.PI / 180);
   ctx.fillStyle = 'red';
   ctx.fillRect(configDetails.posX, configDetails.posY, 300, 300);
   //ctx.font = "10px Arial";
   //ctx.fillStyle = 'white';
   //ctx.fillText(configDetails?.paperType as string, 10, 50);
   //ctx.fillText("bajz", 10, 10);
   ctx.fillStyle = "#ffffff";
   ctx.font = "16px Helvetica";
   ctx.fillText("ABC", 80, 80);
 */
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

  console.log("hej7")





}

