/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    eslint: {
        dirs: ['utils', 'app'] // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
    },
    reactStrictMode: false
}

module.exports = nextConfig
