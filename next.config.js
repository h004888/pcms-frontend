// =====================================================
// PCMS - Next.js 16 Configuration
// Removed next-pwa 5.6.0 (abandoned, incompatible with Next 15+).
// PWA support is disabled in dev via PWAProvider in layout.tsx.
// Turbopack is the default bundler in Next.js 16 (no flag needed).
// =====================================================

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
	},
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "**" },
			{ protocol: "http", hostname: "**" },
		],
	},
	// No rewrites — frontend calls backend directly (CORS handled by gateway).
};

// Module-scope config (Next 16 supports this with TypeScript)
module.exports = nextConfig;
