import { db } from "..";
import type { Session } from "@prisma/client";

export async function fetchAllSessions() : Promise<Session[]> {
  return db.session.findMany({});
}
