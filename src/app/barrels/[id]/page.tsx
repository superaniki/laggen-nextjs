
"use server";
import { fetchOneBarrelById } from "@/db/queries/barrels";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";


interface BarrelShowPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: BarrelShowPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  const barrelName = await fetchOneBarrelById(id).then(barrel => barrel !== null && barrel);

  return {
    title: "Show barrel " + barrelName,
  }
}

// workaround for Canvas import error
const BarrelShow = dynamic(() => import("@/components/barrels/barrel-show"), {
  ssr: false,
});

export default async function BarrelShowPage({ params }: BarrelShowPageProps) {
  const { id } = params;
  ////await new Promise(resolve => setTimeout(resolve, 2500));

  let barrel = await fetchOneBarrelById(id);

  if (!barrel)
    return notFound();

  return (
    <div className="w-full pt-5">
      <div className="container relative min-h-[600px] w-[1024px] border-gray-500 mx-auto">
        <BarrelShow barrel={barrel.barrelDetails} />
      </div>
    </div>
  )
}