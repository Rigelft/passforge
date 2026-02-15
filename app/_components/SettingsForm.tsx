"use client";

import { motion } from "framer-motion";
import { Hash, Settings, Type, ShieldCheck } from "lucide-react";
import styles from "./SettingsForm.module.css";

export type GenerationMode = "Random" | "Memorable" | "PIN";

interface SettingsFormProps {
    mode: GenerationMode;
    setMode: (mode: GenerationMode) => void;
    length: number;
    setLength: (len: number) => void;
    options: {
        uppercase: boolean;
        lowercase: boolean;
        numbers: boolean;
        symbols: boolean;
    };
    setOptions: (options: any) => void;
    wordCount: number;
    setWordCount: (count: number) => void;
    separator: string;
    setSeparator: (sep: string) => void;
}

export default function SettingsForm({
    mode, setMode,
    length, setLength,
    options, setOptions,
    wordCount, setWordCount,
    separator, setSeparator
}: SettingsFormProps) {

    const toggleOption = (key: keyof typeof options) => {
        setOptions({ ...options, [key]: !options[key] });
    };

    return (
        <div className={`${styles.container} glass`}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${mode === "Random" ? styles.activeTab : ""}`}
                    onClick={() => setMode("Random")}
                >
                    <ShieldCheck size={18} />
                    <span>Random</span>
                </button>
                <button
                    className={`${styles.tab} ${mode === "Memorable" ? styles.activeTab : ""}`}
                    onClick={() => setMode("Memorable")}
                >
                    <Type size={18} />
                    <span>Memorable</span>
                </button>
                <button
                    className={`${styles.tab} ${mode === "PIN" ? styles.activeTab : ""}`}
                    onClick={() => setMode("PIN")}
                >
                    <Hash size={18} />
                    <span>PIN</span>
                </button>
            </div>

            <div className={styles.content}>
                {mode === "Random" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={styles.section}>
                            <div className={styles.labelRow}>
                                <label>Password Length</label>
                                <span className={styles.valueDisplay}>{length}</span>
                            </div>
                            <input
                                type="range" min="4" max="64" value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.grid}>
                            {[
                                { id: "uppercase", label: "Uppercase (A-Z)" },
                                { id: "lowercase", label: "Lowercase (a-z)" },
                                { id: "numbers", label: "Numbers (0-9)" },
                                { id: "symbols", label: "Symbols (!@#$)" },
                            ].map((opt) => (
                                <label key={opt.id} className={styles.toggleRow}>
                                    <span>{opt.label}</span>
                                    <div
                                        className={`${styles.toggle} ${options[opt.id as keyof typeof options] ? styles.toggleOn : ""}`}
                                        onClick={() => toggleOption(opt.id as keyof typeof options)}
                                    >
                                        <div className={styles.toggleHandle} />
                                    </div>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}

                {mode === "Memorable" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={styles.section}>
                            <div className={styles.labelRow}>
                                <label>Number of Words</label>
                                <span className={styles.valueDisplay}>{wordCount}</span>
                            </div>
                            <input
                                type="range" min="2" max="10" value={wordCount}
                                onChange={(e) => setWordCount(parseInt(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>

                        <div className={styles.section}>
                            <label>Separator</label>
                            <div className={styles.separatorGrid}>
                                {["-", ".", "_", " "].map((sep) => (
                                    <button
                                        key={sep}
                                        className={`${styles.sepButton} ${separator === sep ? styles.activeSep : ""}`}
                                        onClick={() => setSeparator(sep)}
                                    >
                                        {sep === " " ? "Space" : sep}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {mode === "PIN" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div className={styles.section}>
                            <div className={styles.labelRow}>
                                <label>PIN Length</label>
                                <span className={styles.valueDisplay}>{length}</span>
                            </div>
                            <input
                                type="range" min="4" max="12" value={length}
                                onChange={(e) => setLength(parseInt(e.target.value))}
                                className={styles.rangeInput}
                            />
                        </div>
                        <p className={styles.infoText}>PINs are generated with uniform distribution for maximum security.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
