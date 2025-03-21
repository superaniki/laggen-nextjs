"use server";
import LoadingString from "@/ui/loading-string";
import { fetchOneBarrelById } from "@/db/queries/barrels";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
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
  const barrelName = await fetchOneBarrelById(id).then(barrel => barrel !== null && barrel.barrelDetails.name);

  return {
    title: "Edit barrel " + barrelName,
  }
}

// workaround for Canvas import error
const BarrelEdit = dynamic(() => import("@/components/barrel-editor/barrel-editor"), {
  ssr: false,
});

export default async function BarrelEditPage({ params }: BarrelEditPageProps) {
  const { id } = params;
  ////await new Promise(resolve => setTimeout(resolve, 2500));

  let barrel = await fetchOneBarrelById(id);

  if (!barrel)
    return notFound();

  return (
    <>
      <Head><title>Edit barrel : {barrel.barrelDetails.name}</title></Head>

      <div className="w-full bg-white pt-5">
        <div className="container relative min-h-[600px] border-gray-500 mx-auto">
          <Suspense fallback={<LoadingString />}>
            <BarrelEdit barrel={barrel} />
          </Suspense>
        </div>
      </div>
    </>
  )
}