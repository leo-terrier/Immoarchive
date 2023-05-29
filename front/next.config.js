/** @type {import('next').NextConfig} */
const nextConfig = {
    //output: 'export',
    experimental: {
        appDir: true
    },
    eslint: {
        dirs: ['utils', 'app'] // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
    },
    reactStrictMode: true
}

module.exports = nextConfig

// https://stackoverflow.com/questions/69551667/how-to-generate-static-page-in-next-dynamic-page-next-config-js
// https://stackoverflow.com/questions/61724368/what-is-the-difference-between-next-export-and-next-build-in-next-js
