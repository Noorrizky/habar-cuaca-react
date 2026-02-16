import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Habar Cuaca',
        short_name: 'HabarCuaca',
        description: 'Aplikasi Cuaca Kalimantan Selatan',
        theme_color: '#2563eb', // Blue-600
        icons: [
          {
            src: 'pwa-192x192.png', // Anda perlu menyiapkan icon ini di folder public/
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})