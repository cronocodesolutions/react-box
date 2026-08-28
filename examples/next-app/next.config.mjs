/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The example lives inside the library's repository, so Turbopack's own inference walks up past
  // it looking for a lockfile. Pinning the root keeps the build reading this directory only.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
