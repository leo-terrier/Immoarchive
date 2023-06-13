import { defineConfig } from 'cypress'

export default defineConfig({
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack'
        }
    },
    defaultCommandTimeout: 10000,
    e2e: {
        baseUrl: 'http://localhost:3000'
    }
})
