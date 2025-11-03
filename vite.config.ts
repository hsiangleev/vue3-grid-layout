import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'
import pkg from './package.json'

const banner = `/*!
* ${pkg.name} v${pkg.version}
* (c) ${new Date().getFullYear()} ${pkg.author}
* Repository: ${pkg.repository.url}
* License: ${pkg.license}
* Build: ${new Date().toISOString()}
*/\n`

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const isLib = mode === 'lib'

    return {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src')
            }
        },
        plugins: [
            vue(),
            isLib && dts({
                rollupTypes: true,
                tsconfigPath: './tsconfig.app.json'
            })
        ],
        build: isLib 
            ? {
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
                    },
                    plugins: [
                        {
                            name: 'prepend-banner',
                            generateBundle(_, bundle) {
                                for (const [, chunk] of Object.entries(bundle)) {
                                    if (chunk.type === 'chunk') {
                                        chunk.code = banner + chunk.code
                                    }
                                }
                            }
                        }
                    ]
                }
            }
            : {
                outDir: 'dist-app',
                rollupOptions: {
                    input: path.resolve(__dirname, 'index.html')
                }
            }
    }
})