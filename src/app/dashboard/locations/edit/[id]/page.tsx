"use client";

import { useParams } from "next/navigation";

export default function EditLocationPage() {
  const params = useParams();

  return (
    <div>

      <h1 className="text-2xl font-bold">
        Edit Location
      </h1>

      <p>
        Location ID:
        {params.id}
      </p>

    </div>
  );
}