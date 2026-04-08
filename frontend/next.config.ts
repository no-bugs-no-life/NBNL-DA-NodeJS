import type { NextConfig } from "next";

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
};

const UPLOADS_GLOB = "/uploads/**";

function backendUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    "http://localhost:3000"
  );
}

function uploadsPatternFromUrl(raw: string): RemotePattern | null {
  try {
    const u = new URL(raw.trim());
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      port: u.port || undefined,
      pathname: UPLOADS_GLOB,
    };
  } catch {
    return null;
  }
}

function collectUploadRemotePatterns(): RemotePattern[] {
  const rawUrls = [
    backendUrl(),
    process.env.NEXT_PUBLIC_IMAGE_ORIGIN,
    ...(process.env.NEXT_PUBLIC_IMAGE_ORIGINS?.split(",") ?? []),
  ];
  const seen = new Set<string>();
  const patterns: RemotePattern[] = [];
  for (const raw of rawUrls) {
    if (typeof raw !== "string" || !raw.trim()) continue;
    const p = uploadsPatternFromUrl(raw);
    if (!p) continue;
    const key = `${p.protocol}:${p.hostname}:${p.port ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    patterns.push(p);
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...collectUploadRemotePatterns(),
      {
        protocol: "http",
        hostname: "192.168.1.5",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.sstatic.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    const base = backendUrl();
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
