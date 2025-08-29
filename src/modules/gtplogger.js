// Web-compatible GTP logger shim
import {noop} from './helper.js'

// Browser-compatible logger that uses console and localStorage
export function write(stream) {
  // Log to browser console for debugging
  let typeText = {
    stderr: '(err)',
    stdin: '(in)', 
    stdout: '(out)',
    meta: '(meta)'
  }[stream.type] || ''
  
  let message = `<${stream.engine}> ${typeText}: ${stream.message}`
  
  // Log to console based on stream type
  if (stream.type === 'stderr') {
    console.error(message)
  } else if (stream.type === 'meta') {
    console.info(message)
  } else {
    console.log(message)
  }
  
  // Optionally store in localStorage for persistence (with size limit)
  try {
    let logs = JSON.parse(localStorage.getItem('sabaki_gtp_logs') || '[]')
    logs.push({
      timestamp: new Date().toISOString(),
      engine: stream.engine,
      type: stream.type,
      message: stream.message
    })
    
    // Keep only last 100 log entries to prevent storage overflow
    if (logs.length > 100) {
      logs = logs.slice(-100)
    }
    
    localStorage.setItem('sabaki_gtp_logs', JSON.stringify(logs))
  } catch (e) {
    // Ignore localStorage errors
  }
}

export const updatePath = noop
export const rotate = noop  
export const close = noop

// Default export for compatibility
export default {
  write,
  updatePath,
  rotate,
  close
}
