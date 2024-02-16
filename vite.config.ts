import path from 'node:path'
import * as fs from 'node:fs'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Layouts from 'vite-plugin-vue-layouts'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Pages from 'vite-plugin-pages'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3333,
    https: {
      key: fs.readFileSync('src/cert/server-key.pem'),
      cert: fs.readFileSync('src/cert/server.pem'),
    },
    proxy: {},
  },
  plugins: [
    Vue(),
    VueRouter(),
    Layouts(),
    Pages(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
        },
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),
    Components({
      dts: true,
      resolvers: [NaiveUiResolver()],
    }),
    UnoCSS(),
  ],
})
