"use client";

import LoadingString from "@/ui/loading-string";

export default function Loading() {
  return (
    <div className="w-full bg-white pt-5">
      <div className="container relative min-h-[600px] border-gray-500 mx-auto">
        <div className="flex items-center justify-center w-full h-[600px]">
          <LoadingString />
        </div>
      </div>
    </div>
  );
}
