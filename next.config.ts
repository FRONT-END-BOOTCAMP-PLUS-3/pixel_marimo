import type { NextConfig } from "next"

import path from "path"

const nextConfig: NextConfig = {
  webpack(config) {
    config.resolve.alias["@marimo"] = path.resolve(__dirname, "app")
    return config
  },
}

export default nextConfig
