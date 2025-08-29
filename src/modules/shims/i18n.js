const languages = require('@sabaki/i18n')
const {noop} = require('../helper')

// Simple i18n implementation for web
let currentLanguage = 'en'
let strings = {}

function getKey(input, params = {}) {
  if (typeof input === 'function') {
    return input(params)
  }
  return input
}

const t = (input, params) => {
  let key = getKey(input, params)
  return strings[key] || key
}

const context = (namespace) => {
  return (input, params) => {
    let key = getKey(input, params)
    let namespacedKey = `${namespace}.${key}`
    return strings[namespacedKey] || strings[key] || key
  }
}

module.exports = {
  getKey,
  t,
  context,
  
  formatNumber: (num) => {
    return new Intl.NumberFormat(currentLanguage).format(num)
  },
  
  formatMonth: (month) => {
    let date = new Date()
    date.setMonth(month)
    return date.toLocaleString(currentLanguage, {month: 'long'})
  },
  
  formatWeekday: (weekday) => {
    let date = new Date(2020, 2, 1 + (weekday % 7))
    return date.toLocaleString(currentLanguage, {weekday: 'long'})
  },
  
  formatWeekdayShort: (weekday) => {
    let date = new Date(2020, 2, 1 + (weekday % 7))
    return date.toLocaleString(currentLanguage, {weekday: 'short'})
  },
  
  loadFile: noop
}
