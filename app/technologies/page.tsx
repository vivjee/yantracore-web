"use client";

import { TvFrame } from "@/components/layout/TvFrame";
import { StarSystem } from "@/components/motion/StarSystem";

export default function TechnologiesPage() {
  return (
    <TvFrame>
      <div className="relative w-full h-full overflow-hidden">
        <StarSystem onCenterClick={() => {}} />
      </div>
    </TvFrame>
  );
}

