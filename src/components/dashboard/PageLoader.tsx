// Destination: src/components/dashboard/PageLoader.tsx

import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-accent" />
    </div>
  );
}