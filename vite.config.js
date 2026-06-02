import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En dev, on relaie les appels API via localhost (même origine) vers
      // le serveur de prod. Cela règle le problème de cookie de session
      // cross-site : le cookie est réécrit pour être accepté sur localhost.
      '/cineclub': {
        target: 'https://rasantacruz.fr',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            const cookies = proxyRes.headers['set-cookie']
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                cookie
                  .replace(/;\s*Domain=[^;]+/i, '')
                  .replace(/;\s*Secure/i, '')
                  .replace(/;\s*SameSite=None/i, '; SameSite=Lax'),
              )
            }
          })
        },
      },
    },
  },
})
