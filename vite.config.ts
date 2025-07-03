import { defineConfig, PluginOption, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const plugins: PluginOption[] = [react()];
  
  // Only add lovable-tagger in development mode
  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      plugins.push(componentTagger());
    } catch (error) {
      console.warn('lovable-tagger not available in this environment');
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react', '@radix-ui/react-tabs']
          }
        },
        onwarn(warning: any, warn: any) {
          // Suppress all common development warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          if (warning.code === 'EVAL') return;
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
          if (warning.code === 'THIS_IS_UNDEFINED') return;
          if (warning.message?.includes('Use of eval')) return;
          if (warning.message?.includes('Browserslist')) return;
          warn(warning);
        }
      }
    },
    preview: {
      port: 4173,
      host: true
    }
  };
});
