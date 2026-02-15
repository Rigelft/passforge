"use client";

import { useState } from "react";
import { PasswordResult } from "../_data/generator";
import { Copy, RefreshCw, Check } from "lucide-react";
import styles from "./PasswordDisplay.module.css";
import { motion } from "framer-motion";

interface PasswordDisplayProps {
    password: PasswordResult;
    onRegenerate: () => void;
    dictionary: any;
}

export default function PasswordDisplay({ password, onRegenerate, dictionary }: PasswordDisplayProps) {
    const [copied, setCopied] = useState(false);
    const dict = dictionary;

    const handleCopy = async () => {
        if (!password.value) return;
        await navigator.clipboard.writeText(password.value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStrengthColor = () => {
        switch (password.strength) {
            case "Low": return "var(--strength-low)";
            case "Medium": return "var(--strength-medium)";
            case "High": return "var(--strength-high)";
            default: return "var(--bg-input)";
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.topRow}>
                <span className={styles.strengthLabel} style={{ color: getStrengthColor() }}>
                    {password.strength} {dict.display.security}
                </span>
                <span className={styles.entropy}>
                    {Math.round(password.entropy)} {dict.display.entropy}
                </span>
            </div>

            <div className={styles.mainDisplay}>
                <div className={styles.passwordText}>
                    {password.value || dict.display.generate_placeholder}
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.iconButton}
                        onClick={onRegenerate}
                        title={dict.display.regenerate}
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
                        onClick={handleCopy}
                        disabled={!password.value}
                    >
                        {copied ? (
                            <>
                                <Check size={18} />
                                {dict.display.copied}
                            </>
                        ) : (
                            <>
                                <Copy size={18} />
                                {dict.display.copy}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className={styles.strengthBarContainer}>
                <motion.div
                    className={styles.strengthBar}
                    initial={{ width: 0, backgroundColor: "#334155" }}
                    animate={{
                        width: "100%",
                        backgroundColor: getStrengthColor()
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </div>
    );
}
