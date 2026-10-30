import i18n from '../i18n'

export const sleep = (ms = 0) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Validation */
export const validators = {
  email: (v: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || i18n.global.t('validators.email')
  },
  required: (v: any) => !!v || i18n.global.t('validators.required'),
}
