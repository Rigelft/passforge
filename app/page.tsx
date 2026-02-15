import GeneratorContainer from "./_components/GeneratorContainer";
import styles from "./page.module.css";
import { Shield } from "lucide-react";

export default function Home() {
    return (
        <main className={styles.main}>
            <header className={`${styles.header} animate-fade-in`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Shield size={32} />
                    </div>
                    <div className={styles.brandText}>
                        <h1>Passforge</h1>
                        <p>Cryptographic Entropy Engine</p>
                    </div>
                </div>
                <div className={styles.securityBadge}>
                    CSPRNG Active
                </div>
            </header>

            <div className={`${styles.generatorWrapper} animate-fade-in`} style={{ animationDelay: "0.2s" }}>
                <GeneratorContainer />
            </div>

            <footer className={`${styles.footer} animate-fade-in`} style={{ animationDelay: "0.4s" }}>
                <p>© 2026 Passforge • No database • No cookies • 100% RAM Memory</p>
            </footer>
        </main>
    );
}
