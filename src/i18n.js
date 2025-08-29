// Web-compatible i18n module
import {load as dolmLoad, getKey as dolmGetKey} from 'dolm'
import * as setting from './setting.js'

// Fallback language data
let languages = {
  en: { 
    filename: 'en.i18n.js',
    name: 'English'
  }
}

// Try to load @sabaki/i18n asynchronously
try {
  import('@sabaki/i18n').then(module => {
    if (module && module.default) {
      languages = module.default
    } else if (module) {
      languages = module
    }
  }).catch(() => {
    // Use fallback languages if import fails
  })
} catch (e) {
  // Use fallback languages
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
  return languages
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
