"use server"
import type { BarrelWithUser } from "@/db/queries/barrels";
import BarrelCard from "./barrel-card";
import { deleteBarrel } from "@/actions";
import { useFormState } from "react-dom";
import { Auth } from "@auth/core";
import { auth } from "@/auth";
interface BarrelsListProps {
  fetchPublicData: () => Promise<BarrelWithUser[]>,
  fetchPrivateData: (id: string) => Promise<BarrelWithUser[]>
}

export default async function BarrelsGrid({ fetchPublicData, fetchPrivateData }: BarrelsListProps) {
  const session = await auth();
  let publicBarrels = await fetchPublicData();
  let privateBarrels: BarrelWithUser[] = [];

  if (session) {
    if (session.user?.id)
      privateBarrels = await fetchPrivateData(session.user?.id);

    publicBarrels = publicBarrels.filter(barrel => barrel.userId !== session.user?.id)
  }
  console.log("is logged in!")



  return <>
    {session && <>
      <div className="mx-5 mb-5 text-xl">Private Barrels</div>
      <div className="grid grid-cols-3 gap-0">
        {privateBarrels.map((barrel) => (
          <BarrelCard key={"card" + barrel.id} barrel={barrel} color={"#BBBBEE"} />
        ))}
      </div>
    </>}

    <div className="mx-5 mb-5 text-xl">Public Barrels</div>
    <div className="grid grid-cols-3 gap-0">
      {publicBarrels.map((barrel) => (
        <BarrelCard key={"card" + barrel.id} barrel={barrel} color={"#BBBBEE"} />
      ))}
    </div>
  </>
}

