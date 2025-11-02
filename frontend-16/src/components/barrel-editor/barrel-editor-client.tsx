'use client';

import dynamic from 'next/dynamic';

const BarrelEditor = dynamic(() => import("@/components/barrel-editor/barrel-editor"), {
  ssr: false,
});

export default BarrelEditor;
