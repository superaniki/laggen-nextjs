'use client';

import dynamic from 'next/dynamic';

const BarrelViewer = dynamic(() => import("@/components/barrel-viewer/barrel-viewer"), {
  ssr: false,
});

export default BarrelViewer;
