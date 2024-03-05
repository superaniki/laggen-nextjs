
import { PassThrough } from "stream";
import * as PImage from "pureimage";
import { Barrel, BarrelDetails, StaveCurveConfig, StaveCurveConfigDetails } from "@prisma/client";

import { StaveCurveConfigWithData } from "@/db/queries/barrels";
import { PaperSizes } from "@/common/constants";
import { Paper } from "@/common/enums";
import { drawInfoTextCTX, drawRuler, drawRulerCTX, drawStaveCurveCTX } from "@/common/api-utils";

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
  // Get canvas context
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

  //<Ruler scale={10} y={paperHeight - margins + 5} x={margins - 15} xLength={6} yLength={0} margin={10} />

  //export function drawRuler(scale: number, y: number, x: number, xLength: number, yLength: number, margin: number) {
  /*
  ctx.font = "4pt 'Liberation'";
  ctx.strokeStyle = 'black';
 
  ctx.rotate((-90 * Math.PI) / 180.0);
  ctx.translate(-paperHeight + 23, margins + 4);
  ctx.fillText(staveTemplateInfoText, 0, 0);
  */

  //  ctx.fillText(staveTemplateInfoText, margins, paperHeight - 25);

  //<Text x={margins} rotation={270} y={paperHeight - 25} text={staveTemplateInfoText} fontFamily="courier" fontSize={3} fill={"black"} />




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
}

