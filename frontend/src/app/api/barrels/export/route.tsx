import { BarrelDetails } from "@prisma/client";
import { StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from "@/db/queries/barrels";
import { StaveTool } from "@/common/enums";

export type BarrelExportData = {
  barrelDetails: BarrelDetails,
  staveToolState: StaveTool,
  staveCurveConfig: StaveCurveConfigWithData
  staveEndConfig: StaveEndConfigWithData
  staveFrontConfig: StaveFrontConfigWithData
}


// save button triggering this function accessible from barrel-edit.tsx
export async function POST(request: Request) {
  const barrelExportData: any = await request.json() as BarrelExportData;
  const response = await fetch(process.env.LAGGEN_SERVER_FUNC as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(barrelExportData),
  });

  // Return only the PNG image data
  return new Response(response.body, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
