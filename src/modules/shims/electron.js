const {noop} = require('../helper')

let app = {
  getName: () => 'Sabaki',
  getVersion: () => 'web',
  getPath: () => ''
}

module.exports = {
  app,
  ipcRenderer: {
    on: noop,
    send: noop,
    removeAllListeners: noop
  },

  clipboard: {
    readText: () => {
      if (navigator.clipboard && navigator.clipboard.readText) {
        return navigator.clipboard.readText()
      }
      return Promise.resolve(prompt('Please paste contents here:') || '')
    },

    writeText: (content) => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(content)
      }
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = content
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        document.execCommand('copy')
      } catch (err) {
        console.warn('Clipboard write failed:', err)
      }
      
      document.body.removeChild(textArea)
    }
  },

  shell: {
    openExternal: (href) => {
      const link = document.createElement('a')
      link.href = href
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
