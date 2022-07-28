import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import presets from './presets/presets';

export default defineConfig((env) => {
  // env 环境变量
  const viteEnv = loadEnv(env.mode, process.cwd());
  return {
    base: viteEnv.VITE_BASE,
    plugins: [presets(env)],
    resolve: {
      alias: {
        // 把 @ 指向到 src 目录去
        '@': resolve(__dirname, './src')
      }
    },
    // 服务设置
    server: {
      host: true, // host 设置为 true 才可以使用 network 的形式，以 ip 访问项目
      port: 8081, // 端口号
      open: true, // 自动打开浏览器
      cors: true, // 跨域设置允许
      strictPort: true, // 设为 true 时若端口已被占用则会直接退出
      // 接口代理
      proxy: {
        '/api': {
          target: 'http://localhost:8888/',
          changeOrigin: true, // 允许跨域
          rewrite: (path) => path.replace('/api/', '/')
        },
        '/socket.io': {
          target: 'ws://localhost:3000',
          ws: true
        }
      }
    },
    // 打包配置
    build: {
      brotliSize: false,
      // 消除打包大小超过 500kb 警告,放宽至 2000kb
      chunkSizeWarningLimit: 2000,
      minify: 'terser',
      // 在生产环境移除console.log
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      assetsDir: 'static/assets',
      // 静态资源打包到 dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    css: {
      preprocessorOptions: {
        // 全局引入 scss 的文件
        scss: {
          additionalData: `@import "@/assets/styles/variables.scss";`,
          javascriptEnabled: true
        }
      }
    }
  };
});
