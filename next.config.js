/** @type {import('next').NextConfig} */
function wordpressImageHosts() {
  const hosts = new Set(['dev-headless-next.pantheonsite.io'])
  const raw = process.env.NEXT_PUBLIC_WORDPRESS_URL
  if (raw) {
    try {
      hosts.add(new URL(raw).hostname)
    } catch {
      /* ignore */
    }
  }
  return [...hosts]
}

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: wordpressImageHosts().map((hostname) => ({
      protocol: 'https',
      hostname,
      port: '',
      pathname: '/**',
    })),
  },
}

module.exports = nextConfig
