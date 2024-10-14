"use client"
import type { BarrelWithData } from "@/db/queries/barrels";
import BarrelCard, { BarrelType } from "./barrel-card";
import { Button, Card, Pagination } from "@nextui-org/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import AddBarrelCard from "./add-barrel-card";
import ModalBarrelCreateForm from "./modal-barrel-create-form";
interface BarrelsListProps {
  publicBarrels: BarrelWithData[],
  privateBarrels: BarrelWithData[]
}

export default function BarrelsGrid({ publicBarrels, privateBarrels }: BarrelsListProps) {
  const [publicBarrelsPage, setPublicBarrelsPage] = useState(1);
  const [privateBarrelsPage, setPrivateBarrelsPage] = useState(1)

  const { data: session, status } = useSession()

  const ITEMS_PER_ROW = 4;
  const ITEMS_PER_PAGE_PRIVATE = 4;
  const ITEMS_PER_PAGE_PUBLIC = 8;

  console.log("privateBarrels.length: " + privateBarrels.length)

  const numPrivateBarrelPages = Math.ceil(privateBarrels.length / ITEMS_PER_PAGE_PRIVATE);
  console.log("private barrel pages: " + numPrivateBarrelPages)
  const numPublicBarrelPages = Math.ceil(publicBarrels.length / ITEMS_PER_PAGE_PUBLIC);
  console.log("public barrel pages: " + numPublicBarrelPages)

  const handlePrivatePageChange = (newPage: number) => {
    setPrivateBarrelsPage(newPage);
  };

  const handlePublicPageChange = (newPage: number) => {
    setPublicBarrelsPage(newPage);
  };

  function getBarrelsForPublicPage() {
    const startItem = ((publicBarrelsPage - 1) * ITEMS_PER_PAGE_PUBLIC);
    const pageBarrels = publicBarrels.slice(startItem, startItem + ITEMS_PER_PAGE_PUBLIC);
    return pageBarrels;
  }

  function getBarrelsForPrivatePage() {
    console.log(privateBarrelsPage);

    const startItem = ((privateBarrelsPage - 1) * ITEMS_PER_PAGE_PRIVATE);
    const pageBarrels = privateBarrels.slice(startItem, startItem + ITEMS_PER_PAGE_PRIVATE);
    return pageBarrels;
  }

  return <>
    {status === "authenticated" && <>
      <div className="mx-5 mb-5 text-xl">Private Barrels</div>
      <div className="grid gap-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {privateBarrelsPage === 1 && <ModalBarrelCreateForm>
          <AddBarrelCard />
        </ModalBarrelCreateForm>}

        {getBarrelsForPrivatePage().map((barrel) => (
          <BarrelCard type={BarrelType.private} key={"card" + barrel.id} barrel={barrel} color={"#BBBBEE"} />
        ))}
      </div>

      <div className="flex items-center justify-center">
        <Pagination showControls={true} total={numPrivateBarrelPages} page={privateBarrelsPage} onChange={handlePrivatePageChange} />
      </div>
    </>}

    {publicBarrels.length > 0 &&
      (<>
        <div className="mx-5 mb-5 text-xl">Public Barrels</div>
        <div className="grid gap-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getBarrelsForPublicPage().map((barrel) => (
            <BarrelCard type={BarrelType.public} key={"card" + barrel.id} barrel={barrel} color={"#BBBBEE"} />
          ))}
        </div>

        <div className="flex items-center justify-center">
          <Pagination showControls={true} total={numPublicBarrelPages} page={publicBarrelsPage} onChange={handlePublicPageChange} />
        </div>
      </>
      )
    }

  </>
}
