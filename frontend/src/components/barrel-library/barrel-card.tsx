"use client"
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { BarrelWithData } from "@/db/queries/barrels";
import paths from "@/paths";
import Link from "next/link";
import React, { useState, memo } from "react";
import dynamic from "next/dynamic";
import BarrelActionsDropdown from "./barrel-actions-dropdown";
import useUsersBarrel from "./useUsersBarrel";
import LoadingSpinner from "@/ui/loading-spinner";

// Workaround for Canvas import error - using React.memo to prevent re-renders
const BarrelPreviewCanvas = dynamic(() => import("@/components/barrel-canvas/barrel-canvas-card"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <LoadingSpinner />
    </div>
  ),
});

export enum BarrelType {
  public,
  private
}
interface BarrelCardProps {
  barrel: BarrelWithData,
  color?: string,
  type: BarrelType
}

const PUBLIC_BARREL_COLOR = "bg-gradient-to-t from-green-100 to-blue-100";
const PRIVATE_BARREL_COLOR = "bg-gradient-to-t from-pink-100 to-blue-100";

export default function BarrelCard({ barrel, color, type }: BarrelCardProps) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isPending, setIsPending] = useState<boolean | string>(false);
  const [author, isUsersBarrel, isLoading] = useUsersBarrel(barrel);

  let barrelColor = PUBLIC_BARREL_COLOR;
  if (type === BarrelType.private)
    barrelColor = PRIVATE_BARREL_COLOR;

  // We don't need the canvasLoaded state anymore since we're using the loading placeholder
  
  return <>
    {isPending && <div className="loading">{isPending}<span></span></div>}
    {!isDeleted && !isPending &&
      <Card isHoverable={false} className="card mx-5 mb-10 pb-4 fadeIn-animation">
        <Link href={paths.barrelEdit(barrel.slug)}>
          <CardBody className={`overflow-hidden py-2 h-48 w-full ${barrelColor}`}>
            <BarrelPreviewCanvas 
              barrelDetails={barrel.barrelDetails} 
              color={"#707070"} 
            />
          </CardBody>
        </Link>
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <div className="flex w-full justify-between">
            <div>
              <h4 className="font-bold text-large overflow-hidden text-ellipsis">{barrel.barrelDetails?.name}</h4>
              <small className="text-default-500">
                by {author}
              </small>
            </div>
            <div>
              {isUsersBarrel && <BarrelActionsDropdown barrel={barrel} deleteEnabled={isUsersBarrel}
                handleDelete={() => setIsDeleted(true)} setIsPending={setIsPending} />}
            </div>
          </div>
        </CardHeader>
      </Card >
    }
  </>
}