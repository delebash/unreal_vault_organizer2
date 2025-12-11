import {defineConfig} from 'vite';
import Vue from '@vitejs/plugin-vue';
import Vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
import Fonts from 'unplugin-fonts/vite'

// Utilities
import {fileURLToPath, URL} from 'node:url'

const host = process.env.TAURI_DEV_HOST;
// Replace '<YOUR_REPOSITORY_NAME>' with your actual GitHub repository name
const repoName = 'unreal_vault_organizer2';

// https://vite.dev/config/
export default defineConfig(async () => ({
    base:  "/unreal_vault_organizer2/", // Crucial for correct asset paths
    plugins: [
        Vue({
            template: {transformAssetUrls},
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
        Vuetify({
            autoImport: true,
            styles: {
                configFile: 'src/styles/settings.scss',
            },
        }),
        Fonts({
            fontsource: {
                families: [
                    {
                        name: 'Roboto',
                        weights: [100, 300, 400, 500, 700, 900],
                        styles: ['normal', 'italic'],
                    },
                ],
            },
        }),
    ],
    css: {
        preprocessorOptions: {
            sass: {
                silenceDeprecations: ['if-function'],
            },
        },
    },
    optimizeDeps: {
        exclude: ['vuetify'],
    },
    define: {'process.env': {}},
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('src', import.meta.url)),
        },
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.mjs',
            '.ts',
            '.tsx',
            '.vue',
        ],
    },
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        open: false,
        hmr: host
            ? {
                protocol: "ws",
                host,
                port: 1421,
            }
            : undefined,
        watch: {
            // 3. tell Vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
}));
