import { MetadataRoute } from 'next'
import { i18n } from '../i18n-config'

const BASE_URL = 'https://passforge-peach.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = i18n.locales.map((locale) => ({
        url: `${BASE_URL}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }))

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        ...routes,
    ]
}
