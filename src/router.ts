import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import type { App } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: routes => setupLayouts(routes),
})
export function setupRouter(app: App) {
  app.use(router)
  // 创建路由守卫
  createRouterGuards(router)
}
export { router }
function createRouterGuards(router: any) {
  router.beforeEach(() => {
    window.$loadingBar.start()
  })

  router.afterEach(() => {
    window.$loadingBar.finish()
  })

  router.onError(() => {
    window.$loadingBar.error()
  })
}
