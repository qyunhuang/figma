import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import components from 'unplugin-vue-components/vite'
import unocss from 'unocss/vite'
import banner from 'vite-plugin-banner'
import { createHtmlPlugin } from 'vite-plugin-html'
import { envDir } from './scripts/build'
import path from 'node:path'
import pkg from './package.json'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g
const DRIVE_LETTER_REGEX = /^[a-z]:/i

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir)

  return {
    /**
     * 管理环境变量的配置文件存放目录
     */
    envDir,

    /**
     * 项目部署目录路径
     *
     * @description 见项目根目录下的 `config` 文件夹说明
     */
    base: env.VITE_DEPLOY_BASE_URL,

    /**
     * 本地开发服务，也可以配置接口代理
     *
     * @see https://cn.vitejs.dev/config/#server-proxy
     */
    server: {
      port: 3000,
      // proxy: {
      //   '/devapi': {
      //     target: 'http://192.168.10.198',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/devapi/, ''),
      //   },
      // },
    },

    build: {
      rollupOptions: {
        output: {
          sanitizeFileName(name) {
            const match = DRIVE_LETTER_REGEX.exec(name)
            const driveLetter = match ? match[0] : ''
            return (
              driveLetter +
              name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
            )
          },
        },
      },
    },

    resolve: {
      /**
       * 配置目录别名
       * @see https://cn.vitejs.dev/config/shared-options.html#resolve-alias
       *
       * @example
       *
       *  想从 `src/libs/foo` 文件里导入功能：
       *  配置 alias 前： `import foo from '../../../libs/foo'`
       *  配置 alias 后： `import foo from '@/libs/foo'`
       */
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },

    plugins: [
      /**
       * 支持 `.vue` 文件的解析
       */
      vue(),

      /**
       * 如果需要支持 `.tsx` 组件，请安装 `@vitejs/plugin-vue-jsx` 这个包
       * 在命令行运行安装命令 `npm i -D @vitejs/plugin-vue-jsx`
       * 并在这里添加一个插件导入 `import vueJsx from '@vitejs/plugin-vue-jsx'`
       *
       * @see https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx
       */
      // vueJsx(),

      /**
       * 如果需要兼容低版本浏览器，请安装 `@vitejs/plugin-legacy` 这个包
       * 同时还需要安装 `terser` 包，因为旧版插件使用 Terser 进行混淆和压缩。
       * 在命令行运行安装命令 `npm i -D @vitejs/plugin-legacy terser`
       * 并在这里添加一个插件导入 `import legacy from '@vitejs/plugin-legacy'`
       *
       * @see https://github.com/vitejs/vite/tree/main/packages/plugin-legacy
       */
      // legacy({
      //   targets: ['defaults', 'not IE 11'],
      // }),

      /**
       * 自动导入 API ，不用每次都 import
       *
       * @tips 如果直接使用没导入的 API 依然提示报错，请重启 VS Code
       *
       * @see https://github.com/antfu/unplugin-auto-import#configuration
       */
      autoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/declaration-files/auto-import.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),

      /**
       * 自动导入组件，不用每次都 import
       *
       * @see https://github.com/antfu/unplugin-vue-components#configuration
       */
      components({
        dirs: ['src/components'],
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
        globalNamespaces: [],
        extensions: ['vue', 'ts', 'tsx'],
        deep: true,
        dts: 'src/types/declaration-files/components.d.ts',
      }),

      /**
       * 开箱即用的 Tailwind CSS 风格原子类引擎
       *
       * @description 配置文件见 `uno.config.ts`
       *
       * @see https://unocss.dev/integrations/vite
       */
      unocss(),

      /**
       * 版权注释
       *
       * @see https://github.com/chengpeiquan/vite-plugin-banner#advanced-usage
       */
      banner(
        [
          `/**`,
          ` * name: ${pkg.name}`,
          ` * version: v${pkg.version}`,
          ` * description: ${pkg.description}`,
          ` * author: ${pkg.author}`,
          ` */`,
        ].join('\n'),
      ),

      /**
       * 为入口文件增加 EJS 模版能力
       *
       * @see https://github.com/vbenjs/vite-plugin-html/blob/main/README.zh_CN.md
       */
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            appTitle: env.VITE_APP_TITLE,
            appDesc: env.VITE_APP_DESC,
            appKeywords: env.VITE_APP_KEYWORDS,
          },
        },
      }),
    ],
  }
})
