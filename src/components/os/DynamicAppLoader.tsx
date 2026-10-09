"use client";

import React, { lazy, Suspense, useMemo } from "react";

// In a real plugin system, this map would be populated at runtime
// via an API or manifest-based loader.
const PLUGIN_COMPONENTS: Record<string, React.LazyExoticComponent<any>> = {
  // Example: 
  // "some-plugin": lazy(() => import("@/plugins/SomePlugin")),
};

interface DynamicAppLoaderProps {
  appId: string;
  fallback?: React.ReactNode;
  [key: string]: any; // Props passed to the app
}

export function DynamicAppLoader({ appId, fallback = <div>Loading...</div>, ...props }: DynamicAppLoaderProps) {
  const Component = useMemo(() => {
    return PLUGIN_COMPONENTS[appId];
  }, [appId]);

  if (!Component) {
    return <div>App component not found for: {appId}</div>;
  }

  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
}
