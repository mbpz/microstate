const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const path = require('path')

// Get the absolute path to the project root
const projectRoot = path.resolve(__dirname, '../../..')

module.exports = defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    alias: {
      '@microstate': path.resolve(projectRoot, 'src')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})