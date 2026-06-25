/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' — Vercel handles Next.js SSR/SSG natively.
  // Static export mode breaks dynamic routes, API routes, and Vercel's
  // built-in image optimization + Edge Network features.
  images: {
    // Allow Firebase Storage image URLs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.firebasestorage.app',
      },
    ],
  },
  // Ensure all NEXT_PUBLIC_ vars are inlined at build time
  // (already the default for NEXT_PUBLIC_ prefix, listed here for clarity)
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY             || '',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         || '',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID          || '',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      || '',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    NEXT_PUBLIC_FIREBASE_APP_ID:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID              || '',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID      || '',
    NEXT_PUBLIC_FORCE_MOCK:                   process.env.NEXT_PUBLIC_FORCE_MOCK                   || 'false',
  },
};

export default nextConfig;
