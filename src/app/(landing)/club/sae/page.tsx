'use client'

import dynamic from "next/dynamic";

const Model = dynamic(() => import("@/components/wall"), { ssr: false });

export default function Home() {
  return (
    <main className="flex grow">
      <Model />
    </main>
  );
}
