

"use server";
import { auth } from "../auth"
import BarrelCreateForm from "@/components/barrels/barrel-create-form";
import { BarrelWithUser, fetchBarrelsFromUser, fetchPublicBarrels } from "@/db/queries/barrels";
import { UsersList } from "@/components/users/users-list";
import { fetchAllUsers } from "@/db/queries/users";
import { AccountsList } from "@/components/users/account-list";
import { SessionsList } from "@/components/users/session-list";
import BarrelsGrid from "@/components/barrels/barrels-grid";
import { Suspense } from "react";
import { CircularProgress } from "@nextui-org/react";

export default async function Home() {

  const session = await auth();
  let publicBarrels = await fetchPublicBarrels();
  let privateBarrels: BarrelWithUser[] = [];

  if (session) {
    if (session.user?.id)
      privateBarrels = await fetchBarrelsFromUser(session.user?.id);
    publicBarrels = publicBarrels.filter(barrel => barrel.userId !== session.user?.id)
  }

  const loader = <div className="h-full flex items-center justify-center">
    <CircularProgress color="primary" aria-label="Loading..." /> </div>;

  return (
    <div className="w-full bg-white pt-5">
      <div className="container relative border-gray-500 mb-5 mx-auto px-10">
        <div className="grid grid-cols-12 gap-6 h-full min-h-[800px]">
          <div className="hidden md:visible md:grid col-span-2 content-start gap-2">
            <BarrelCreateForm />
          </div>
          <div className="col-span-12 md:col-span-10 h-full mb-16">
            <div className="md:hidden flex mx-5 mb-5 text-xl">
              <BarrelCreateForm />
            </div>

            <Suspense fallback={loader}>
              <BarrelsGrid publicBarrels={publicBarrels} privateBarrels={privateBarrels} />
            </Suspense>
          </div>
        </div>
      </div>
    </div >
  )
}