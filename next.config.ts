import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  experimental: {
    // Route handler /api/uploads membaca body lewat cloneable-body Next yang
    // dibatasi proxyClientMaxBodySize (default 10MB). Di atas batas body
    // dipotong (bukan ditolak) -> multipart rusak -> formData() throw -> 500.
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
