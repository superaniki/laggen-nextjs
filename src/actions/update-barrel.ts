"use server";
import { revalidatePath } from "next/cache";
import { Barrel, BarrelDetails, StaveCurveConfig, StaveCurveConfigDetails } from "@prisma/client";
import { db } from "@/db";
import { BarrelWithData, StaveCurveConfigWithData } from "@/db/queries/barrels";
import { auth } from "@/auth";
import { createSlug } from "./utils";


export async function updateBarrel(barrel: Barrel, barrelDetails: BarrelDetails, staveCurveConfig: StaveCurveConfigWithData,
  staveCurveConfigDetails : StaveCurveConfigDetails[] ) {
  const session = await auth();

  if (session?.user?.id !== barrel.userId)
    return;

  const { updatedAt, ...onlyBarrel } = barrel; // omit unrelated properties

  const dbBarrel = await db.barrelDetails.findFirst({
    where: { id: barrelDetails.id }});
  
  if(dbBarrel?.name !== barrelDetails.name){
    // update the slug since name has changed
    let newSlug = await createSlug(barrelDetails.name);
    await db.barrel.update({
      where: { id: barrelDetails.barrelId },
      data: { ...onlyBarrel, slug: newSlug},
    });
  }

  await db.barrelDetails.update({
    where: { id: barrelDetails.id },
    data: { ...barrelDetails },
  });

  const {configDetails, ...onlyStaveCurveConfig} = {...staveCurveConfig}

  await db.staveCurveConfig.update({
    where: { id: staveCurveConfig.id },
    data: { ...onlyStaveCurveConfig }
  })

  for (let i = 0; i < staveCurveConfigDetails.length; i++) {
    await db.staveCurveConfigDetails.update({
      where: { id: staveCurveConfigDetails[i].id },
      data: { ...staveCurveConfigDetails[i] }
    })
  }

  revalidatePath(`/barrels/edit/${barrel.id}`);
}



/*
export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}
*/

// revalidate homepage(with the library) after editing a barrel
// revalidate show barrel page