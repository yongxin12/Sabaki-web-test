import {h, Component} from 'preact'

// Web-compatible ThemeManager component shim
// In the browser, we'll handle themes via CSS variables or classes
export default class ThemeManager extends Component {
  constructor(props) {
    super(props)
    this.applyTheme()
  }

  componentDidMount() {
    this.applyTheme()
  }

  applyTheme() {
    // In browser environment, we can apply themes via CSS classes or CSS variables
    // For now, we'll apply a default theme
    document.body.className = (document.body.className || '').replace(/theme-\w+/g, '') + ' theme-default'
  }

  render() {
    // ThemeManager doesn't render any visible content, it just manages themes
    return null
  }
}
