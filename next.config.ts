import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Payload sirve las imágenes subidas desde /media a través de su propia ruta.
  images: {
    remotePatterns: [],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
