/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        ppr: true
    },
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "goimages.s3.ap-south-1.amazonaws.com",
            port: ""
        }]
    }
};

export default nextConfig;
