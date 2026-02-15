import { Locale } from "../../i18n-config";

interface JsonLdProps {
    lang: Locale;
    dict: any;
}

export default function JsonLd({ lang, dict }: JsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": dict.meta.title,
        "operatingSystem": "Web",
        "applicationCategory": "SecurityApplication",
        "description": dict.meta.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "inLanguage": lang,
        "url": `https://passforge-peach.vercel.app/${lang}`,
        "author": {
            "@type": "Person",
            "name": "Felicio"
        }
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </section>
    );
}
