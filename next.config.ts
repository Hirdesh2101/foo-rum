import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "d140p29c73x6ns.cloudfront.net",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
