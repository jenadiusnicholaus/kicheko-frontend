import { watch } from 'vue'
import { createI18n } from 'vue-i18n'

const fileNameToLocaleModuleDict = import.meta.glob<{ default: Record<string, string> }>('./locales/*.json', {
  eager: true,
})

const messages: { [P: string]: Record<string, string> } = {}
Object.entries(fileNameToLocaleModuleDict)
  .map(([fileName, localeModule]) => {
    const fileNameParts = fileName.split('/')
    const fileNameWithoutPath = fileNameParts[fileNameParts.length - 1]
    const localeName = fileNameWithoutPath.split('.json')[0]

    return [localeName, localeModule.default] as const
  })
  .forEach((localeNameLocaleMessagesTuple) => {
    messages[localeNameLocaleMessagesTuple[0]] = localeNameLocaleMessagesTuple[1]
  })

const LOCALE_KEY = 'kicheko-locale'
const savedLocale = localStorage.getItem(LOCALE_KEY)

const i18n = createI18n({
  legacy: false,
  locale: savedLocale || 'sw',
  fallbackLocale: 'gb',
  messages,
})

// Persist the selected language so it survives reloads.
watch(i18n.global.locale, (l) => {
  localStorage.setItem(LOCALE_KEY, l)
})

export default i18n
