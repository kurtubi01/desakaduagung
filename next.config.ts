import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'opwrvqtpgkdyiptqcyvq.supabase.co',
            },
        ],
    },
};

export default nextConfig;
