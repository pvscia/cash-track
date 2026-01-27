import React, { Suspense, lazy } from "react";

export default function LazyLoadRoutes(importFunc) {
  const Component = lazy(() => importFunc);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
}
