"use server";
import LoadingString from "@/ui/loading-string";
import { fetchOneBarrelById } from "@/db/queries/barrels";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

import { notFound } from "next/navigation";
import { Suspense } from "react";

interface BarrelEditPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: BarrelEditPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  const barrelName = await fetchOneBarrelById(id).then(barrel => barrel !== null && barrel.barrelDetails.name);

  return {
    title: "Edit barrel " + barrelName,
  }
}

const BarrelEdit = dynamic(() => import("@/components/barrel-editor/barrel-editor"), {
  ssr: false,
});

export default async function BarrelEditPage({ params }: BarrelEditPageProps) {
  const { id } = params;
  
  let barrel = await fetchOneBarrelById(id);

  if (!barrel)
    return notFound();

  return (
    <>
      <div className="w-full bg-white pt-5">
        <div className="container relative min-h-[600px] border-gray-500 mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center w-full h-[600px]">
              <LoadingString />
            </div>
          }>
            <BarrelEdit barrel={barrel} />
          </Suspense>
        </div>
      </div>
    </>
  )
}