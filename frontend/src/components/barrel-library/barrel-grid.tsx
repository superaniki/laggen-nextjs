"use client"
import type { BarrelWithData } from "@/db/queries/barrels";
import BarrelCard, { BarrelType } from "./barrel-card";
import { Pagination } from "@nextui-org/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import AddBarrelCard from "./add-barrel-card";
import BarrelCreateFormModal from "./barrel-create-form-modal";
interface BarrelsListProps {
  publicBarrels: BarrelWithData[],
  privateBarrels: BarrelWithData[]
}

export default function BarrelGrid({ publicBarrels, privateBarrels }: BarrelsListProps) {
  const [publicBarrelsPage, setPublicBarrelsPage] = useState(1);
  const [privateBarrelsPage, setPrivateBarrelsPage] = useState(1);

  const { data: session, status } = useSession();

  const ITEMS_PER_ROW = 5; // Match xl:grid-cols-5
  const ITEMS_PER_PAGE_PRIVATE = 5; // Show 5 items per page (including Add New Barrel card)
  const ITEMS_PER_PAGE_PUBLIC = 8;

  // Calculate total pages
  const numPrivateBarrelPages = Math.max(
    1, 
    Math.ceil(privateBarrels.length / ITEMS_PER_PAGE_PRIVATE)
  );
  const numPublicBarrelPages = Math.ceil(publicBarrels.length / ITEMS_PER_PAGE_PUBLIC);

  const handlePrivatePageChange = (newPage: number) => {
    setPrivateBarrelsPage(newPage);
  };

  const handlePublicPageChange = (newPage: number) => {
    setPublicBarrelsPage(newPage);
  };

  function barrelsForPublicPage() {
    const startItem = ((publicBarrelsPage - 1) * ITEMS_PER_PAGE_PUBLIC);
    const pageBarrels = publicBarrels.slice(startItem, startItem + ITEMS_PER_PAGE_PUBLIC);
    return pageBarrels;
  }

  function barrelsForPrivatePage() {
    // Calculate which barrels to show on the current page
    let startItem = 0;
    let itemsToTake = ITEMS_PER_PAGE_PRIVATE;
    
    if (privateBarrelsPage === 1) {
      // On first page, account for the create card
      itemsToTake = ITEMS_PER_PAGE_PRIVATE - 1;
    } else {
      // For subsequent pages
      const firstPageItems = ITEMS_PER_PAGE_PRIVATE - 1;
      startItem = firstPageItems + ((privateBarrelsPage - 2) * ITEMS_PER_PAGE_PRIVATE);
    }
    
    const pageBarrels = privateBarrels.slice(startItem, startItem + itemsToTake);
    return pageBarrels;
  }

  return <>
    {status === "authenticated" && <>
      <div className="mx-5 mb-5 text-xl">Private Barrels</div>
      <div className="grid gap-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {privateBarrelsPage === 1 && (
          <BarrelCreateFormModal>
            <AddBarrelCard />
          </BarrelCreateFormModal>
        )}
        
        {barrelsForPrivatePage().map((barrel) => (
          <BarrelCard 
            type={BarrelType.private} 
            key={"card" + barrel.id} 
            barrel={barrel} 
            color={"#BBBBEE"} 
          />
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
          {barrelsForPublicPage().map((barrel) => (
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
