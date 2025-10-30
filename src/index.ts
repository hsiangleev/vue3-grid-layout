import type { App } from 'vue'
import * as components from '@/components/index'
export * from '@/components/index'

export const gridNestedInstall = {
    install: (app: App) => {
        const Components = Object.assign({}, components) as Record<string, any>
        for (const c in Components) {
            app.use(Components[c])
        }
    }
}