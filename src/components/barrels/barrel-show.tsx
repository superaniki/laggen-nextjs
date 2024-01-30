"use client";
import { Barrel } from "@prisma/client";
import { useRef, useEffect, useState } from "react";
import BarrelCanvas from "../canvas/barrel-canvas";
import Head from "next/head";

export default function BarrelShow({ barrel }: { barrel: Barrel }) {
  if (barrel === null)
    return "loading";

  return (  /*md:h-full */
    <>
      <Head><title>Show barrel : {barrel.name}</title></Head>
      <BarrelCanvas barrel={barrel} useGrid={false} />
    </>)
}
