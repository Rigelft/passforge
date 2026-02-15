"use client";

import { motion } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./PasswordDisplay.module.css";
import { PasswordResult } from "../_data/generator";

interface PasswordDisplayProps {
    password: PasswordResult;
    onRegenerate: () => void;
}

export default function PasswordDisplay({ password, onRegenerate }: PasswordDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!password.value) return;
        try {
            await navigator.clipboard.writeText(password.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const strengthColor = {
        Low: "var(--strength-low)",
        Medium: "var(--strength-medium)",
        High: "var(--strength-high)"
    }[password.strength];

    return (
        <div className={`${styles.container} glass`}>
            <div className={styles.topRow}>
                <span className={styles.strengthLabel} style={{ color: strengthColor }}>
                    {password.strength} Security
                </span>
                <span className={styles.entropy}>
                    {password.entropy} bits of entropy
                </span>
            </div>

            <div className={styles.mainDisplay}>
                <div className={`${styles.passwordText} mono`}>
                    {password.value || "Generate a password..."}
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.iconButton}
                        onClick={onRegenerate}
                        title="Regenerate"
                    >
                        <RefreshCw size={20} />
                    </button>

                    <button
                        className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
                        onClick={handleCopy}
                        disabled={!password.value}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                </div>
            </div>

            <div className={styles.strengthBarContainer}>
                <motion.div
                    className={styles.strengthBar}
                    initial={{ width: 0 }}
                    animate={{
                        width: password.value ? `${(password.entropy / 128) * 100}%` : 0,
                        backgroundColor: strengthColor
                    }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );
}
