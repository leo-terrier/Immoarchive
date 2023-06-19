import { defineConfig } from 'cypress'

export default defineConfig({
    projectId: 'm7wuo9',
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack'
        }
    },
    defaultCommandTimeout: 10000,
    e2e: {
        baseUrl: 'http://localhost:3001'
    }
})
