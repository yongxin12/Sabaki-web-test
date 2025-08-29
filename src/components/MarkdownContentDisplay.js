import {h, Component, toChildArray} from 'preact'
import * as helper from '../modules/helper.js'

import ContentDisplay from './ContentDisplay.js'

// Simplified markdown renderer to avoid react-markdown dependency issues
export default class MarkdownContentDisplay extends Component {
  render() {
    let {source = '', text = ''} = this.props
    let content = source || text

    // Simple markdown-to-HTML conversion for basic support
    let html = content
      .replace(/\n/g, '<br>')  // Line breaks
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')  // Italic
      .replace(/`(.*?)`/g, '<code>$1</code>')  // Code
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="comment-external">$1</a>')  // Links

    return h(ContentDisplay, {
      tag: 'div',
      ...this.props,

      children: h('div', {
        dangerouslySetInnerHTML: {__html: html}
      })
    })
  }
}
