
export const objectValues = (obj) => obj ? Object.keys(obj).map(i => obj[i]) : []

export const findTranslation = (translations, locale) => {
    if (!translations) return null

    if (translations[locale] !== undefined) return translations[locale]

    const defaultLocale = Object.keys(translations)[0]

    return translations[defaultLocale]
}