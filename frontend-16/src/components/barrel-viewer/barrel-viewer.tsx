"use client";
import { BarrelDetails } from "@prisma/client";
import BarrelCanvas from "@/components/barrel-canvas/barrel-canvas";
import Head from "next/head";

export default function BarrelViewer({ barrel }: { barrel: BarrelDetails }) {
  if (barrel === null)
    return "loading";

  return (  /*md:h-full */
    <>
      <Head><title>Show barrel : {barrel.name}</title></Head>
      <BarrelCanvas barrel={barrel} useGrid={false} />
    </>)
}
