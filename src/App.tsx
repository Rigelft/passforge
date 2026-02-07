import { useMemo } from "react";
import { PasswordHistory } from "@/components/PasswordHistory";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { ToastProvider } from "@/components/ToastProvider";
import { usePasswordHistory } from "@/hooks/usePasswordHistory";
import styles from "@/styles/app.module.css";

export default function App() {
  const history = usePasswordHistory();

  const footerLinks = useMemo(
    () => [
      { label: "X (Twitter)", href: "https://x.com/fdroyalking?t=k3LcXpMN0EnoYW-vaCJMqA&s=09" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/f%C3%A9licio-de-souza-4a3ba3285/" },
      { label: "GitHub", href: "https://github.com/Rigelft" },
    ],
    [],
  );

  return (
    <ToastProvider>
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <div className={styles.brand}>
              <img src="/img/logo.svg" width={144} height={50} alt="PassForge" draggable={false} />
              <span className={styles.tagline}>Un mot de passe robuste, en un clic.</span>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.hero} aria-label="Générateur de mot de passe">
            <div className={styles.heroInner}>
              <h1 className={styles.title}>Générateur de mots de passe ultra‑robustes</h1>
              <p className={styles.subtitle}>
                Tout se passe localement dans votre navigateur. Aucun mot de passe n’est envoyé vers un serveur.
              </p>

              <div className={styles.grid}>
                <PasswordGenerator onAddToHistory={history.add} />
                <PasswordHistory
                  items={history.items}
                  onClear={history.clear}
                  onRemove={history.remove}
                />
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <span>© {new Date().getFullYear()} PassForge — par Félicio.</span>
            <nav aria-label="Liens" className={styles.footerLinks}>
              {footerLinks.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}
