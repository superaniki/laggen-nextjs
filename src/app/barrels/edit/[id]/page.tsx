
"use server";
import BarrelEdit from "@/components/barrels/barrel-edit";
import LoadingString from "@/components/common/loading-string";
import { BarrelWithUser, fetchOneBarrelById } from "@/db/queries/barrels";
import { Barrel } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import Head from "next/head";
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
  const barrelName = await fetchOneBarrelById(id).then(barrel => barrel !== null && barrel.name);

  return {
    title: "Edit barrel " + barrelName,
  }
}

export default async function BarrelEditPage({ params }: BarrelEditPageProps) {
  const { id } = params;
  ////await new Promise(resolve => setTimeout(resolve, 2500));

  let barrel: BarrelWithUser | null = null;
  barrel = await fetchOneBarrelById(id);

  if (!barrel)
    return notFound();

  return (
    <>
      <Head><title>Edit barrel : {barrel.name}</title></Head>

      <div className="w-full bg-white pt-5">
        <div className="container relative min-h-[600px] border-gray-500 mx-auto">
          <Suspense fallback={<LoadingString />}>
            <BarrelEdit barrelWithUser={barrel} />
          </Suspense>
        </div>
      </div>
    </>
  )
}