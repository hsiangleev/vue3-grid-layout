import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [
        vue(),
        dts({
            rollupTypes: true,
            tsconfigPath: './tsconfig.app.json'
        })
    ],
    build: {
        sourcemap: true,
        outDir: 'dist',
        minify: true,
        lib: {
            entry: 'src/index.ts',
            name: 'vue3-grid-nested',
            fileName: (format) => `vue3-grid-nested.${format}.js`
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    }
})
