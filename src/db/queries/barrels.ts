import { db } from "..";
import type { Barrel } from "@prisma/client";

//export 


export type BarrelWithUser = Barrel & {
  user: { name: string | null };
};

export async function fetchAllBarrels() : Promise<BarrelWithUser[]> {
  return db.barrel.findMany({
    orderBy: { 
      updatedAt : "desc"
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
}

export async function fetchOneBarrelById(id:string) : Promise<BarrelWithUser | null> {
  return db.barrel.findFirst({
    where: {
      OR: [
        { id: id }, { slug: id }
      ]
    },
    include: {
      user: { select: { name: true } },
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