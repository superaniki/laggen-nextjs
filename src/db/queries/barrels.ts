import { db } from "..";
import type { Barrel, BarrelDetails, StaveCurveConfig, StaveCurveConfigDetails } from "@prisma/client";

export type StaveCurveConfigWithData = StaveCurveConfig & {
  configDetails : StaveCurveConfigDetails[]
}

export type BarrelWithData = Barrel & {
  user: { name: string | null }
  barrelDetails : BarrelDetails
  staveCurveConfig : StaveCurveConfigWithData
};

/*

model StaveCurveConfig {
  id               String                    @id @default(cuid())
  defaultPaperType String // A4 or A3
  canvasData       StaveCurveConfigDetails[] // Assuming StaveCurveConfigDetails is another model
  barrel           Barrel                    @relation(fields: [barrelId], references: [id], onDelete: Cascade)
  barrelId         String                    @unique
}*/

export async function fetchAllBarrels() : Promise<BarrelWithData[]> {
  const barrels = <BarrelWithData[]> await db.barrel.findMany({
    orderBy: { 
      updatedAt : "desc"
    },
    include: {
      user: { select: { name: true, image: true } },
      staveCurveConfig : {
        include: {configDetails : true }
      },
      barrelDetails : true
    },
  });

  //const filteredBarrels = barrels.filter((item) => item.staveCurveConfig !== null );
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
    include: {
      user: { select: { name: true, image: true } },
      staveCurveConfig : {
        include: {configDetails : true }
      },
      barrelDetails : true
    },
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
    include: {
      user: { select: { name: true, image: true } },
      staveCurveConfig : {
        include: {configDetails : true }
      },
      barrelDetails : true
    },
  });
}

export async function fetchOneBarrelById(id:string) : Promise<BarrelWithData | null> {
  return <BarrelWithData> await db.barrel.findFirst({
    where: {
      OR: [
        { id: id }, { slug: id }
      ]
    },
    include: {
      user: { select: { name: true } },
      staveCurveConfig : {
        include: {configDetails : true }
      },
      barrelDetails : true
    },
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