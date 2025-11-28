import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow } from 'electron'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDev = process.env.NODE_ENV === 'development'
const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    resizable: true,
    title: 'TAM Stitch Workspace',
    backgroundColor: '#0f111a',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (isDev) {
    win.loadURL(devServerUrl)
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html')
    win.loadFile(indexPath)
  }

  win.on('ready-to-show', () => {
    win.show()
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
