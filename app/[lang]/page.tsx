import GeneratorContainer from "../_components/GeneratorContainer";
import styles from "../page.module.css";
import { Shield } from "lucide-react";
import { getDictionary } from "../_dictionaries/get-dictionary";
import { Locale } from "../../i18n-config";

export default async function Home({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as Locale);

    return (
        <main className={styles.main}>
            <header className={`${styles.header} animate-fade-in`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Shield size={32} />
                    </div>
                    <div className={styles.brandText}>
                        <h1>{dict.home.title}</h1>
                        <p>{dict.home.subtitle}</p>
                    </div>
                </div>
                <div className={styles.securityBadge}>
                    {dict.home.csp_badge}
                </div>
            </header>

            <div className={`${styles.generatorWrapper} animate-fade-in`} style={{ animationDelay: "0.2s" }}>
                <GeneratorContainer dictionary={dict} />
            </div>

            <footer className={`${styles.footer} animate-fade-in`} style={{ animationDelay: "0.4s" }}>
                <p>{dict.home.footer}</p>
            </footer>
        </main>
    );
}
