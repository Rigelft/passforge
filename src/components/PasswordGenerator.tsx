import { useCallback, useMemo, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { copyToClipboard } from "@/lib/clipboard";
import {
  DEFAULT_SYMBOLS,
  estimateEntropyBits,
  generatePassword,
  strengthFromEntropy,
  type PasswordOptions,
} from "@/lib/passwordUi";
import type { PasswordHistoryAddInput } from "@/types";
import ui from "@/components/ui.module.css";
import styles from "@/components/passwordGenerator.module.css";

type Props = {
  onAddToHistory: (input: PasswordHistoryAddInput) => void;
};

export function PasswordGenerator({ onAddToHistory }: Props) {
  const toast = useToast();

  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [ensureEachSelectedType, setEnsureEachSelectedType] = useState(true);
  const [autoCopy, setAutoCopy] = useState(true);
  const [saveToHistory, setSaveToHistory] = useState(true);

  const [symbols, setSymbols] = useState(DEFAULT_SYMBOLS);
  const [accountName, setAccountName] = useState("");

  const [hidden, setHidden] = useState(false);
  const [value, setValue] = useState("");
  const [lastEntropyBits, setLastEntropyBits] = useState(0);

  const opts: PasswordOptions = useMemo(
    () => ({
      length,
      includeUppercase,
      includeNumbers,
      includeSymbols,
      excludeAmbiguous,
      ensureEachSelectedType,
      symbols,
    }),
    [ensureEachSelectedType, excludeAmbiguous, includeNumbers, includeSymbols, includeUppercase, length, symbols],
  );

  const strength = useMemo(() => strengthFromEntropy(lastEntropyBits), [lastEntropyBits]);
  const toneTextClass =
    strength.tone === "success"
      ? styles.toneSuccess
      : strength.tone === "warning"
        ? styles.toneWarning
        : styles.toneDanger;
  const toneFillClass =
    strength.tone === "success"
      ? styles.fillSuccess
      : strength.tone === "warning"
        ? styles.fillWarning
        : styles.fillDanger;

  const doCopy = useCallback(
    async (text: string) => {
      const ok = await copyToClipboard(text);
      if (ok) toast.push("Mot de passe copié.", "success");
      else toast.push("Impossible de copier automatiquement.", "danger");
    },
    [toast],
  );

  const onGenerate = useCallback(async () => {
    try {
      const res = generatePassword(opts);
      setValue(res.value);
      setHidden(false);
      setLastEntropyBits(estimateEntropyBits(res.length, res.charsetSize));

      if (saveToHistory) onAddToHistory({ password: res.value, accountName });

      if (autoCopy) await doCopy(res.value);
      else toast.push("Mot de passe généré.", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      toast.push(msg, "danger");
    }
  }, [accountName, autoCopy, doCopy, onAddToHistory, opts, saveToHistory, toast]);

  return (
    <div className={ui.card}>
      <div className={ui.cardHeader}>
        <h2 className={ui.cardTitle}>Générateur</h2>
        <p className={ui.cardSubtitle}>
          Génération cryptographiquement sécurisée via <code>crypto.getRandomValues()</code>.
        </p>
      </div>

      <div className={ui.cardBody}>
        <div className={styles.outputWrap}>
          <div className={`${styles.output} ${ui.mono}`} aria-label="Mot de passe généré">
            {value ? (hidden ? "•".repeat(Math.min(32, value.length)) : value) : "Votre mot de passe apparaîtra ici"}
          </div>
          <div className={styles.outputActions}>
            <button className={ui.btn} onClick={onGenerate}>
              Générer
            </button>
            <button className={ui.btn} onClick={() => doCopy(value)} disabled={!value}>
              Copier
            </button>
            <button className={ui.btn} onClick={() => setHidden((x) => !x)} disabled={!value}>
              {hidden ? "Afficher" : "Masquer"}
            </button>
          </div>
        </div>

        <div className={styles.meterWrap} aria-label="Force du mot de passe">
          <div className={styles.meterTop}>
            <span>
              Force: <strong className={toneTextClass}>{strength.label}</strong>
            </span>
            <span className={styles.bits}>{Math.round(lastEntropyBits)} bits</span>
          </div>
          <div className={styles.meter}>
            <div className={`${styles.meterFill} ${toneFillClass}`} style={{ width: `${strength.percent}%` }} />
          </div>
        </div>

        <div className={ui.row}>
          <div className={ui.field}>
            <label htmlFor="length">Longueur</label>
            <div className={styles.lengthRow}>
              <input
                id="length"
                type="range"
                min={8}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className={styles.range}
              />
              <span className={styles.lengthValue}>{length}</span>
            </div>
          </div>

          <div className={ui.field}>
            <label htmlFor="account">Nom du compte (optionnel)</label>
            <input
              id="account"
              className={ui.input}
              value={accountName}
              onChange={(e) => {
                const up = e.target.value.toUpperCase().slice(0, 20);
                setAccountName(up);
              }}
              placeholder="EX: FACEBOOK"
              autoComplete="off"
              inputMode="text"
            />
          </div>
        </div>

        <div className={styles.switchGrid}>
          <label className={ui.switchRow}>
            <span>
              Majuscules <small>Inclure A‑Z</small>
            </span>
            <input
              className={ui.checkbox}
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />
          </label>
          <label className={ui.switchRow}>
            <span>
              Chiffres <small>Inclure 0‑9</small>
            </span>
            <input
              className={ui.checkbox}
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
          </label>
          <label className={ui.switchRow}>
            <span>
              Symboles <small>Inclure caractères spéciaux</small>
            </span>
            <input
              className={ui.checkbox}
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
          </label>
          <label className={ui.switchRow}>
            <span>
              Exclure ambigus <small>Évite O/0, I/l/1…</small>
            </span>
            <input
              className={ui.checkbox}
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            />
          </label>
          <label className={ui.switchRow}>
            <span>
              Forcer chaque type <small>Au moins 1 caractère de chaque type sélectionné</small>
            </span>
            <input
              className={ui.checkbox}
              type="checkbox"
              checked={ensureEachSelectedType}
              onChange={(e) => setEnsureEachSelectedType(e.target.checked)}
            />
          </label>
          <label className={ui.switchRow}>
            <span>
              Copier automatiquement <small>Après génération</small>
            </span>
            <input
              className={ui.checkbox}
              type="checkbox"
              checked={autoCopy}
              onChange={(e) => setAutoCopy(e.target.checked)}
            />
          </label>
          <label className={ui.switchRow}>
            <span>
              Enregistrer l’historique <small>Désactivez pour ne rien conserver</small>
            </span>
            <input
              className={ui.checkbox}
              type="checkbox"
              checked={saveToHistory}
              onChange={(e) => setSaveToHistory(e.target.checked)}
            />
          </label>
        </div>

        {includeSymbols ? (
          <div className={styles.symbols}>
            <label htmlFor="symbols">Symboles personnalisés (optionnel)</label>
            <input
              id="symbols"
              className={ui.input}
              value={symbols}
              onChange={(e) => setSymbols(e.target.value)}
              placeholder={DEFAULT_SYMBOLS}
              spellCheck={false}
            />
            <div className={styles.symbolHint}>Astuce: supprimez les symboles que vous n’aimez pas.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
