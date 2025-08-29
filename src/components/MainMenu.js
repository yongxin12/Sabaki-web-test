import {Component} from 'preact'

// Web-compatible MainMenu component - simplified for browser environment
export default class MainMenu extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // No menu handling needed in web environment
    // Menu functionality is handled through the UI components directly
  }

  componentWillUnmount() {
    // No cleanup needed
  }

  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps[key] !== this.props[key]) return true
    }

    return false
  }

  render() {
    // In web version, menu is integrated into the UI, not a separate component
    return null
  }
}
