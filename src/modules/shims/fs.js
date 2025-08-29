const {noop} = require('../helper')

// File system shim for web environment
module.exports = {
  readFile: (file, encoding, callback) => {
    if (typeof encoding === 'function') {
      callback = encoding
      encoding = 'utf8'
    }
    
    if (file instanceof File) {
      const reader = new FileReader()
      reader.onload = (evt) => callback(null, evt.target.result)
      reader.onerror = (evt) => callback(new Error('Failed to read file'))
      
      if (encoding === 'utf8' || encoding === 'utf-8') {
        reader.readAsText(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
    } else {
      callback(new Error('File not found'))
    }
  },

  readFileSync: (path, encoding) => {
    // Cannot synchronously read files in browser
    console.warn('readFileSync not supported in browser environment')
    return ''
  },

  writeFile: (path, data, callback = noop) => {
    // Use File API to download file
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = path.split('/').pop() || 'file.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    if (callback) callback(null)
  },

  writeFileSync: (path, data) => {
    // Use File API to download file
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = path.split('/').pop() || 'file.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  mkdirSync: noop,
  accessSync: noop,
  existsSync: () => false,
  statSync: () => ({ isDirectory: () => false }),

  constants: {
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
    X_OK: 1
  }
}
