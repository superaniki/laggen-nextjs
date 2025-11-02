
import { fetchOneBarrelById } from "@/db/queries/barrels";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BarrelViewer from "@/components/barrel-viewer/barrel-viewer-client";


interface BarrelShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  { params }: BarrelShowPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const barrelName = await fetchOneBarrelById(id).then(barrel => barrel !== null && barrel);

  return {
    title: "Show barrel " + barrelName,
  }
}

export default async function BarrelShowPage({ params }: BarrelShowPageProps) {
  const { id } = await params;
  ////await new Promise(resolve => setTimeout(resolve, 2500));

  let barrel = await fetchOneBarrelById(id);

  if (!barrel)
    return notFound();

  return (
    <div className="w-full pt-5">
      <div className="container relative min-h-[600px] w-[1024px] border-gray-500 mx-auto">
        <BarrelViewer barrel={barrel.barrelDetails} />
      </div>
    </div>
  )
}