"use server";
import { revalidatePath } from "next/cache";
import { Barrel } from "@prisma/client";
import { db } from "@/db";
export async function updateBarrel(id:string, barrel:Barrel){
    const { updatedAt, ...newBarrel } = barrel; // omit the old date

    await db.barrel.update({
      where: { id },
      data: { ...newBarrel },
    });
    revalidatePath(`/barrels/edit/${id}`);
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