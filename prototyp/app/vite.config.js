import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('mb-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ica-elements': path.resolve(__dirname, '../node_modules/@ica-azure/ica-elements'),
      // Stubs — pekar produktionens importnamn till prototypens mock-filer.
      // Se prototyp/app/src/stubs/README.md för detaljer.
      'shared-utils/src/scanner': path.resolve(__dirname, 'src/stubs/scanner.ts'),
      'shared-utils/src/imageUtils': path.resolve(__dirname, 'src/stubs/imageUtils.ts'),
      'shared-components': path.resolve(__dirname, 'src/stubs/shared-components.ts')
    }
  },
  define: {
    'process.env.ICA_ELEMENTS_NAMESPACE': JSON.stringify('mb')
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
      ]
    }
  }
})
