"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, History } from "lucide-react";
import styles from "./HistoryList.module.css";
import { PasswordResult } from "../_data/generator";

interface HistoryListProps {
    history: PasswordResult[];
    onDelete: (index: number) => void;
    onClear: () => void;
}

export default function HistoryList({ history, onDelete, onClear }: HistoryListProps) {
    const handleCopy = (val: string) => {
        navigator.clipboard.writeText(val);
    };

    return (
        <div className={`${styles.container} glass`}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <History size={20} className={styles.icon} />
                    <h3>Session History</h3>
                </div>
                {history.length > 0 && (
                    <button className={styles.clearBtn} onClick={onClear}>
                        Clear All
                    </button>
                )}
            </div>

            <div className={styles.list}>
                {history.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Generated passwords will appear here.</p>
                        <span>History is cleared on page refresh.</span>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {history.map((item, idx) => (
                            <motion.div
                                key={`${item.value}-${idx}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={styles.item}
                            >
                                <div className={styles.itemContent}>
                                    <span className={`${styles.password} mono`}>{item.value}</span>
                                    <div className={styles.meta}>
                                        <span
                                            className={styles.strengthDot}
                                            style={{
                                                backgroundColor: {
                                                    Low: "var(--strength-low)",
                                                    Medium: "var(--strength-medium)",
                                                    High: "var(--strength-high)"
                                                }[item.strength]
                                            }}
                                        />
                                        <span>{item.strength}</span>
                                    </div>
                                </div>

                                <div className={styles.itemActions}>
                                    <button onClick={() => handleCopy(item.value)} title="Copy">
                                        <Copy size={16} />
                                    </button>
                                    <button onClick={() => onDelete(idx)} title="Delete" className={styles.deleteBtn}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
