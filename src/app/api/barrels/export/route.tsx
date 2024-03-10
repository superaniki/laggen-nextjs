
import { PassThrough } from "stream";
import * as PImage from "pureimage";
import { BarrelDetails } from "@prisma/client";
import { StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from "@/db/queries/barrels";
import { StaveTool } from "@/common/enums";
import { createStaveToolsPImage } from "@/export/drawStaveToolsCTX";


export type BarrelExportData = {
  barrelDetails: BarrelDetails,
  staveToolState: StaveTool,
  staveCurveConfig: StaveCurveConfigWithData
  staveEndConfig: StaveEndConfigWithData
  staveFrontConfig: StaveFrontConfigWithData
}

export async function POST(request: Request) {
  const barrelExportData: any = await request.json() as BarrelExportData
  const barrelToolsBitmap = createStaveToolsPImage(barrelExportData);
  const passThroughStream = new PassThrough();

  if (barrelToolsBitmap === undefined)
    return; // better error response HERE
  PImage.encodePNGToStream(barrelToolsBitmap, passThroughStream); // skip await. dont return if scale is too large...
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

