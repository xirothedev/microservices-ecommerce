import type { NextConfig } from "next";
import withDevToolsJSON from "next-plugin-devtools-json";

const nextConfig: NextConfig = {
	output: "standalone",
	experimental: {
		viewTransition: true,
		authInterrupts: true,
	},
	images: {
		unoptimized: process.env.NODE_ENV !== "production",
	},
};

export default withDevToolsJSON(nextConfig);
