const EventEmitter = require('events')

let settings = {}
let themesDict = null

let defaults = {
  'app.always_show_result': false,
  'app.enable_hardware_acceleration': true,
  'app.hide_busy_delay': 200,
  'app.lang': 'en',
  'app.loadgame_delay': 100,
  'app.startup_check_updates': false,
  'app.startup_check_updates_delay': 3000,
  'app.zoom_factor': 1,
  'autoplay.max_sec_per_move': 99,
  'autoplay.sec_per_move': 1,
  'autoscroll.delay': 400,
  'autoscroll.diff': 10,
  'autoscroll.max_interval': 200,
  'autoscroll.min_interval': 50,
  'board.analysis_interval': 50,
  'board.analysis_type': 'winrate',
  'board.show_analysis': true,
  'board.variation_replay_mode': 'move_by_move',
  'board.variation_instant_replay': false,
  'board.variation_replay_interval': 500,
  'cleanmarkup.annotations': false,
  'cleanmarkup.arrow': true,
  'cleanmarkup.circle': true,
  'cleanmarkup.comments': false,
  'cleanmarkup.cross': true,
  'cleanmarkup.hotspots': false,
  'cleanmarkup.label': true,
  'cleanmarkup.line': true,
  'cleanmarkup.square': true,
  'cleanmarkup.triangle': true,
  'cleanmarkup.winrate': false,
  'comments.show_move_interpretation': true,
  'comments.commit_delay': 500,
  'console.max_history_count': 1000,
  'debug.dev_tools': false,
  'edit.click_currentvertex_to_remove': true,
  'edit.copy_variation_strip_props': [
    'AP', 'CA', 'FF', 'GM', 'ST', 'SZ', 'KM', 'HA',
    'AN', 'BR', 'BT', 'CP', 'DT', 'EV', 'GN', 'GC', 'ON',
    'OT', 'PB', 'PC', 'PW', 'RE', 'RO', 'RU', 'SO', 'TM',
    'US', 'WR', 'WT'
  ],
  'edit.flatten_inherit_root_props': [
    'BR', 'BT', 'DT', 'EV', 'GN', 'GC', 'PB',
    'PW', 'RE', 'SO', 'SZ', 'WT', 'WR'
  ],
  'edit.history_batch_interval': 500,
  'edit.max_history_count': 1000,
  'edit.show_removenode_warning': true,
  'edit.show_removeothervariations_warning': true,
  'engines.list': [],
  'file.show_reload_warning': false,
  'find.delay': 100,
  'game.default_board_size': 19,
  'game.default_komi': 6.5,
  'game.default_handicap': 0,
  'game.goto_end_after_loading': false,
  'game.navigation_analysis_delay': 500,
  'game.navigation_sensitivity': 40,
  'game.show_ko_warning': true,
  'game.show_suicide_warning': true,
  'gamechooser.show_delay': 100,
  'gamechooser.thumbnail_size': 153,
  'graph.delay': 100,
  'graph.grid_size': 22,
  'graph.node_size': 4,
  'gtp.console_log_enabled': false,
  'gtp.console_log_path': null,
  'gtp.engine_quit_timeout': 3000,
  'gtp.move_delay': 300,
  'score.estimator_iterations': 100,
  'scoring.method': 'territory',
  'sgf.comment_properties': ['C', 'N', 'UC', 'GW', 'DM', 'GB', 'BM', 'TE', 'DO', 'IT'],
  'sgf.format_code': false,
  'sound.capture_delay_max': 500,
  'sound.capture_delay_min': 300,
  'sound.enable': true,
  'theme.custom_whitestones': null,
  'theme.custom_blackstones': null,
  'theme.custom_board': null,
  'theme.custom_background': null,
  'theme.current': null,
  'view.animated_stone_placement': true,
  'view.fuzzy_stone_placement': true,
  'view.properties_height': 50,
  'view.properties_minheight': 20,
  'view.show_menubar': true,
  'view.show_leftsidebar': false,
  'view.show_comments': true,
  'view.show_coordinates': false,
  'view.show_graph': true,
  'view.show_move_colorization': true,
  'view.show_move_numbers': false,
  'view.show_next_moves': true,
  'view.show_siblings': true,
  'view.leftsidebar_width': 250,
  'view.leftsidebar_minwidth': 100,
  'view.sidebar_width': 280,
  'view.sidebar_minwidth': 100,
  'view.winrategraph_height': 60,
  'view.winrategraph_minheight': 25,
  'view.winrategraph_invert': false,
  'infooverlay.duration': 2000,
  'window.height': 604,
  'window.minheight': 440,
  'window.minwidth': 526,
  'window.width': 564,
  'window.maximized': false
}

// Use a single EventEmitter for web version
exports.events = new EventEmitter()
exports.events.setMaxListeners(100)

// Web-specific paths (will be empty or default)
exports.userDataDirectory = ''
exports.themesDirectory = ''
exports.settingsPath = 'localStorage'
exports.stylesPath = ''

exports.load = function() {
  // Load settings from localStorage
  try {
    const stored = localStorage.getItem('sabaki_settings')
    if (stored) {
      settings = JSON.parse(stored)
    }
  } catch (err) {
    console.warn('Failed to load settings from localStorage:', err)
    settings = {}
  }

  // Load default settings
  for (let key in defaults) {
    if (!(key in settings)) {
      settings[key] = defaults[key]
    }
  }

  // Clean up invalid settings
  for (let key in settings) {
    if (!(key in defaults)) {
      delete settings[key]
    }
  }

  return exports.save()
}

exports.loadThemes = function() {
  // Return empty themes object for web version
  themesDict = {}
  return themesDict
}

exports.save = function() {
  try {
    // Save settings to localStorage
    const keys = Object.keys(settings).sort()
    const sortedSettings = keys.reduce((acc, key) => {
      acc[key] = settings[key]
      return acc
    }, {})
    
    localStorage.setItem('sabaki_settings', JSON.stringify(sortedSettings, null, 2))
  } catch (err) {
    console.warn('Failed to save settings to localStorage:', err)
  }

  return exports
}

exports.get = function(key) {
  if (key in settings) return settings[key]
  if (key in defaults) return defaults[key]
  return null
}

exports.set = function(key, value) {
  settings[key] = value
  exports.save()
  exports.events.emit('change', {key, value})
  return exports
}

exports.getThemes = function() {
  if (themesDict == null) exports.loadThemes()
  return themesDict
}

// Initialize settings
exports.load()
