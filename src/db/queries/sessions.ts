import { db } from "..";
import type { Session } from "@prisma/client";

//export 

/*
export type BarrelWithData = Barrel & {
  user: { name: string | null };
};*/

export async function fetchAllSessions() : Promise<Session[]> {
  return db.session.findMany({});
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