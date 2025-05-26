"use server";
import { revalidatePath } from "next/cache";
import { Barrel, BarrelDetails, StaveCurveConfig, StaveCurveConfigDetails, StaveEndConfigDetails, StaveFrontConfigDetails } from "@prisma/client";
import { db } from "@/db";
import { BarrelWithData, StaveCurveConfigWithData, StaveEndConfigWithData, StaveFrontConfigWithData } from "@/db/queries/barrels";
import { auth } from "@/auth";
import { createSlug } from "./utils";
import { redirect } from "next/navigation";


export async function updateBarrel(barrel: Barrel, barrelDetails: BarrelDetails, 
  staveCurveConfig: StaveCurveConfigWithData, staveCurveConfigDetails : StaveCurveConfigDetails[], 
  staveFrontConfig: StaveFrontConfigWithData, staveFrontConfigDetails : StaveFrontConfigDetails[],
  staveEndConfig: StaveEndConfigWithData, staveEndConfigDetails : StaveEndConfigDetails[] ) {
  const session = await auth();

  if (session?.user?.id !== barrel.userId)
    return;

  const { updatedAt, ...onlyBarrel } = barrel; // omit unrelated properties

  const dbBarrel = await db.barrelDetails.findFirst({
    where: { id: barrelDetails.id }});
  
  let currentSlug = barrel.slug;
  if(dbBarrel?.name !== barrelDetails.name){
    // update the slug since name has changed
    currentSlug = await createSlug(barrelDetails.name);
    await db.barrel.update({
      where: { id: barrelDetails.barrelId },
      data: { ...onlyBarrel, slug: currentSlug},
    });
  }

  await db.barrelDetails.update({
    where: { id: barrelDetails.id },
    data: { ...barrelDetails },
  });

  const {configDetails : curve, ...onlyStaveCurveConfig} = {...staveCurveConfig}

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

  const {configDetails: front, ...onlyStaveFrontConfig} = {...staveFrontConfig}

  await db.staveFrontConfig.update({
    where: { id: staveFrontConfig.id },
    data: { ...onlyStaveFrontConfig }
  })

  for (let i = 0; i < staveFrontConfigDetails.length; i++) {
    await db.staveFrontConfigDetails.update({
      where: { id: staveFrontConfigDetails[i].id },
      data: { ...staveFrontConfigDetails[i] }
    })
  }

  const {configDetails: end, ...onlyStaveEndConfig} = {...staveEndConfig}

  await db.staveEndConfig.update({
    where: { id: staveEndConfig.id },
    data: { ...onlyStaveEndConfig }
  })

  for (let i = 0; i < staveEndConfigDetails.length; i++) {
    await db.staveEndConfigDetails.update({
      where: { id: staveEndConfigDetails[i].id },
      data: { ...staveEndConfigDetails[i] }
    })
  }

  revalidatePath(`/edit/${barrel.id}`);
  redirect(`/edit/${currentSlug}`);
}