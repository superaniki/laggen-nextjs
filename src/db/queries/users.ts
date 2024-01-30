import { db } from "..";
import type { User } from "@prisma/client";

//export 

/*
export type BarrelWithData = Barrel & {
  user: { name: string | null };
};*/

export async function fetchAllUsers() : Promise<User[]> {
  return db.user.findMany({
 /*   include: {
      user: { select: { name: true, image: true } },
    },*/
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