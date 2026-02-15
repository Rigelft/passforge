import { i18n, Locale } from "../../i18n-config";
import { getDictionary } from "../_dictionaries/get-dictionary";
import JsonLd from "../_components/JsonLd";
import "../globals.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return {
        metadataBase: new URL('https://passforge-peach.vercel.app'),
        title: dict.meta.title,
        description: dict.meta.description,
        keywords: dict.meta.keywords,
        alternates: {
            canonical: `/${lang}`,
            languages: {
                'en': '/en',
                'fr': '/fr',
                'es': '/es',
                'de': '/de',
                'it': '/it',
                'pt': '/pt',
                'ru': '/ru',
                'zh': '/zh',
                'ja': '/ja',
                'ko': '/ko',
                'ar': '/ar',
                'hi': '/hi',
            },
        },
    };
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale); // Fetch dictionary for JsonLd

    return (
        <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
            <body suppressHydrationWarning={true}>
                <JsonLd lang={lang as Locale} dict={dict} />
                {children}
            </body>
        </html>
    );
}
