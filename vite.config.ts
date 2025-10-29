import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true
        })
    ],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'Vue3-Grid-Layout',
            fileName: (format) => `Vue3-Grid-Layout.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        },
        sourcemap: true,
        minify: true
    }
})
