import { BarrelExportData } from "@/common/types";

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
