import {h, Component} from 'preact'
import sabaki from '../modules/sabaki.js'
import ColorThief from '@mariotacke/color-thief'
import setting from '../setting.js'

const colorThief = new ColorThief()

async function getColorFromPath(path) {
  try {
    let img = new Image()
    img.src = path
    await new Promise(resolve => img.addEventListener('load', resolve))

    return colorThief.getColor(img)
  } catch (err) {}
}

function getForeground([r, g, b]) {
  return Math.max(r, g, b) < 255 / 2 ? 'white' : 'black'
}

export default class ThemeManager extends Component {
  constructor() {
    super()

    this.updateSettingState()

    // Fixed event listener for web environment
    setting.events.on('change', ({key}) =>
      this.updateSettingState(key)
    )
  }

  shouldComponentUpdate() {
    // In web version, themes are simpler so we don't need complex change detection
    return false
  }

  updateSettingState(key) {
    // In web environment, we'll use simplified theme handling
    if (key == null || key.startsWith('theme.')) {
      this.applyWebTheme()
    }
  }

  applyWebTheme() {
    // Apply default web theme via CSS classes
    document.body.className = (document.body.className || '').replace(/theme-\w+/g, '') + ' theme-default'
  }

  componentDidMount() {
    this.applyWebTheme()
  }

  componentDidUpdate() {
    this.applyWebTheme()
  }

  render() {
    // In web version, return basic theme styles
    return h(
      'style',
      {},
      `
        .theme-default {
          --shudan-board-background-color: #EBB55B;
          --shudan-board-border-color: rgba(33, 24, 9, .2);
          --shudan-board-foreground-color: rgba(33, 24, 9, 1);
          --shudan-black-background-color: black;
          --shudan-black-foreground-color: white;
          --shudan-white-background-color: white;
          --shudan-white-foreground-color: black;
        }
      `
    )
  }
}
