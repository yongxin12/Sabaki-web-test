const {noop} = require('../helper')

let app = {
  getName: () => 'Sabaki',
  getVersion: () => 'web',
  getPath: () => ''
}

module.exports = {
  app,
  require: (moduleName) => {
    if (moduleName === './setting') {
      return require('../../setting')
    }
    return {}
  },

  getCurrentWindow: () => ({
    show: noop,
    close: () => window.close(),
    on: noop,
    isMaximized: () => false,
    isMinimized: () => false,
    isFullScreen: () => document.fullscreenElement !== null,
    setFullScreen: (fullscreen) => {
      if (fullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else if (!fullscreen && document.fullscreenElement) {
        document.exitFullscreen()
      }
    },
    setMenuBarVisibility: noop,
    setAutoHideMenuBar: noop,
    setProgressBar: noop,
    setContentSize: noop,
    getContentSize: () => [window.innerWidth, window.innerHeight],
    webContents: {
      setAudioMuted: (muted) => {
        // Set audio muted state for all audio elements
        const audioElements = document.querySelectorAll('audio')
        audioElements.forEach(audio => {
          audio.muted = muted
        })
      }
    }
  }),

  Menu: require('./Menu'),
  
  dialog: {
    showMessageBoxSync: (window, options) => {
      const message = options.message || ''
      const buttons = options.buttons || ['OK']
      
      if (buttons.length === 1) {
        alert(message)
        return 0
      } else {
        return confirm(message) ? 0 : (options.cancelId || 1)
      }
    },
    
    showOpenDialogSync: (window, options) => {
      return new Promise((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = options.properties && options.properties.includes('multiSelections')
        
        if (options.filters) {
          const extensions = options.filters.flatMap(filter => 
            filter.extensions.map(ext => ext === '*' ? '*' : `.${ext}`)
          )
          input.accept = extensions.join(',')
        }
        
        input.onchange = (e) => {
          const files = Array.from(e.target.files)
          resolve(files.length > 0 ? files.map(f => f.name) : undefined)
        }
        
        input.click()
      })
    },
    
    showSaveDialogSync: (window, options) => {
      const filename = prompt('Enter filename:', options.defaultPath || 'untitled.sgf')
      return filename ? filename : undefined
    }
  }
}
