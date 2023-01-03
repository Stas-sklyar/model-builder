import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import svgrPlugin from 'vite-plugin-svgr'

export default defineConfig({
  define: {
    // Warning! Do not remove the property "global"
    // Without this property, an error occurs: 
    // "ReferenceError: global is not defined at node_modules/amazon-cognito-identity-js/node_modules/buffer/index.js"
    // Solution: https://github.com/nuxt/framework/discussions/2308#discussioncomment-2582519
    "global": {},
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin()
  ]
})