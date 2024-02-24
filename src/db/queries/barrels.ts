import { db } from "..";
import type { Barrel, BarrelDetails, StaveCurveConfig, StaveCurveConfigDetails, StaveEndConfig, StaveEndConfigDetails, StaveFrontConfig, StaveFrontConfigDetails } from "@prisma/client";

export type StaveCurveConfigWithData = StaveCurveConfig & {
  configDetails : StaveCurveConfigDetails[]
}

export type StaveFrontConfigWithData = StaveFrontConfig & {
  configDetails : StaveFrontConfigDetails[]
}

export type StaveEndConfigWithData = StaveEndConfig & {
  configDetails : StaveEndConfigDetails[]
}
export type BarrelWithData = Barrel & {
  user: { name: string | null }
  barrelDetails : BarrelDetails
  staveCurveConfig : StaveCurveConfigWithData
  staveFrontConfig : StaveFrontConfigWithData
  staveEndConfig : StaveEndConfigWithData
};

const barrelSelectionConfig = {
  user: { select: { name: true, image: true } },
  staveCurveConfig : {
    include: {configDetails : true }
  },
  staveFrontConfig : {
    include: {configDetails : true }
  },
  staveEndConfig : {
    include: {configDetails : true }
  },
  barrelDetails : true
};

export async function fetchAllBarrels() : Promise<BarrelWithData[]> {
  const barrels = <BarrelWithData[]> await db.barrel.findMany({
    orderBy: { 
      updatedAt : "desc"
    },
    include: barrelSelectionConfig
  });

  return barrels;
}

export async function fetchPublicBarrels() : Promise<BarrelWithData[]> {
  return <BarrelWithData[]> await db.barrel.findMany({
    where: {
      barrelDetails : { isPublic : true }
    },
    orderBy: { 
      updatedAt : "desc"
    },
    include: barrelSelectionConfig
  });
}

export async function fetchBarrelsFromUser(userId : string) : Promise<BarrelWithData[]> {
  return <BarrelWithData[]> await db.barrel.findMany({
    where:{
      userId : userId
    },
    orderBy: { 
      updatedAt : "desc"
    },
    include: barrelSelectionConfig
  });
}

export async function fetchOneBarrelById(id:string) : Promise<BarrelWithData | null> {
  return <BarrelWithData> await db.barrel.findFirst({
    where: {
      OR: [
        { id: id }, { slug: id }
      ]
    },
    include: barrelSelectionConfig
  });
}

/*
export function fetchTopPosts(): Promise<PostWithData[]> {
  return db.post.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true } },
    },
    take: 5
  });
}*/