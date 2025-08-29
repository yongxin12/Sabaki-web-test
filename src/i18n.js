// Web-compatible i18n module
import {load as dolmLoad, getKey as dolmGetKey} from 'dolm'
import * as setting from './setting.js'

// Fallback language data with proper structure
let languages = {
  en: { 
    filename: 'en.i18n.js',
    name: 'English',
    nativeName: 'English',
    stats: {
      progress: 1.0,
      translatedStringsCount: 100
    }
  },
  zh: {
    filename: 'zh.i18n.js', 
    name: 'Chinese',
    nativeName: '中文',
    stats: {
      progress: 0.95,
      translatedStringsCount: 95
    }
  },
  ja: {
    filename: 'ja.i18n.js',
    name: 'Japanese', 
    nativeName: '日本語',
    stats: {
      progress: 0.90,
      translatedStringsCount: 90
    }
  },
  ko: {
    filename: 'ko.i18n.js',
    name: 'Korean',
    nativeName: '한국어', 
    stats: {
      progress: 0.85,
      translatedStringsCount: 85
    }
  }
}

// Try to load @sabaki/i18n asynchronously
try {
  import('@sabaki/i18n').then(module => {
    if (module && module.default) {
      // Merge imported languages with our fallback structure
      const importedLanguages = module.default
      for (const [key, lang] of Object.entries(importedLanguages)) {
        languages[key] = {
          ...lang,
          stats: lang.stats || {
            progress: 1.0,
            translatedStringsCount: 100
          }
        }
      }
    } else if (module) {
      // Handle direct export
      for (const [key, lang] of Object.entries(module)) {
        languages[key] = {
          ...lang,
          stats: lang.stats || {
            progress: 1.0,
            translatedStringsCount: 100
          }
        }
      }
    }
  }).catch(() => {
    // Use fallback languages if import fails
    console.log('Using fallback language data')
  })
} catch (e) {
  // Use fallback languages
  console.log('Using fallback language data due to import error')
}

let appLang = setting ? setting.get('app.lang') : 'en'

export const getKey = (input, params = {}) => {
  let key = dolmGetKey(input, params)
  return key.replace(/&(?=\w)/g, '')
}

const dolm = dolmLoad({}, getKey)

export const t = dolm.t
export const context = dolm.context

export const formatNumber = function(num) {
  return new Intl.NumberFormat(appLang).format(num)
}

export const formatMonth = function(month) {
  let date = new Date()
  date.setMonth(month)
  return date.toLocaleString(appLang, {month: 'long'})
}

export const formatWeekday = function(weekday) {
  let date = new Date(2020, 2, 1 + (weekday % 7))
  return date.toLocaleString(appLang, {weekday: 'long'})
}

export const formatWeekdayShort = function(weekday) {
  let date = new Date(2020, 2, 1 + (weekday % 7))
  return date.toLocaleString(appLang, {weekday: 'short'})
}

function loadStrings(strings) {
  dolm.load(strings)
}

export const loadFile = function(filename) {
  // In browser environment, we can't read files directly
  // Load empty strings for now
  loadStrings({})
}

export const loadLang = function(lang) {
  appLang = lang
  loadFile(languages[lang] ? languages[lang].filename : 'en.i18n.js')
}

export const getLanguages = function() {
  // Ensure all languages have proper stats structure
  const processedLanguages = {}
  for (const [key, lang] of Object.entries(languages)) {
    processedLanguages[key] = {
      ...lang,
      stats: lang.stats || {
        progress: 1.0,
        translatedStringsCount: 100
      }
    }
  }
  return processedLanguages
}

if (appLang != null) {
  loadLang(appLang)
}

// Default export for compatibility with existing imports
export default {
  getKey,
  t,
  context,
  formatNumber,
  formatMonth,
  formatWeekday,
  formatWeekdayShort,
  loadFile,
  loadLang,
  getLanguages
}
