"use server";
import { BarrelLibrary } from "@/components/barrel-library/barrel-library";
import { auth } from "../auth"
import { BarrelWithData, fetchBarrelsFromUser, fetchPublicBarrels } from "@/db/queries/barrels";

export default async function Home() {

  const session = await auth();
  let publicBarrels = await fetchPublicBarrels();
  let privateBarrels: BarrelWithData[] = [];

  if (session) {
    if (session.user?.id)
      privateBarrels = await fetchBarrelsFromUser(session.user?.id);
    publicBarrels = publicBarrels.filter(barrel => barrel.userId !== session.user?.id)
  }

  return (
    <div className="w-full bg-white pt-5">
      <div className="container relative border-gray-500 mx-auto px-10">
        <BarrelLibrary publicBarrels={publicBarrels} privateBarrels={privateBarrels} />
      </div>
    </div >
  )
}