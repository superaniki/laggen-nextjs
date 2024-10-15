import { Suspense } from "react";

import { CircularProgress } from "@nextui-org/react";
import { BarrelWithData } from "@/db/queries/barrels";
import BarrelsGrid from "./partials/barrels-grid";

interface BarrelsLibraryProps {
  publicBarrels: BarrelWithData[],
  privateBarrels: BarrelWithData[]
}

export function BarrelsLibrary({ publicBarrels, privateBarrels }: BarrelsLibraryProps) {
  const loader = <div className="h-full flex items-center justify-center">
    <CircularProgress color="primary" aria-label="Loading..." /> </div>;

  return <div className="grid grid-cols-10 gap-6 h-full min-h-[800px]" >
    <div className="col-span-12 md:col-span-10 h-full mb-16">
      <Suspense fallback={loader}>
        <BarrelsGrid publicBarrels={publicBarrels} privateBarrels={privateBarrels} />
      </Suspense>
    </div>
  </div>
}