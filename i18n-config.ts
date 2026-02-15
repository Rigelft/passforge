export const i18n = {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
