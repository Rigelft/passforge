"use client";

import { useState, useEffect, useCallback } from "react";
import PasswordDisplay from "./PasswordDisplay";
import SettingsForm, { GenerationMode } from "./SettingsForm";
import HistoryList from "./HistoryList";
import {
    generateRandom,
    generateMemorable,
    generatePIN,
    PasswordResult
} from "../_data/generator";
import styles from "./GeneratorContainer.module.css";

export default function GeneratorContainer() {
    const [mode, setMode] = useState<GenerationMode>("Random");
    const [length, setLength] = useState(16);
    const [wordCount, setWordCount] = useState(3);
    const [separator, setSeparator] = useState("-");
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });

    const [currentPassword, setCurrentPassword] = useState<PasswordResult>({
        value: "",
        strength: "Low",
        entropy: 0
    });

    const [history, setHistory] = useState<PasswordResult[]>([]);

    const handleGenerate = useCallback(() => {
        let result: PasswordResult;

        if (mode === "Random") {
            result = generateRandom(length, options);
        } else if (mode === "Memorable") {
            result = generateMemorable(wordCount, separator);
        } else {
            result = generatePIN(length);
        }

        if (result.value) {
            setCurrentPassword(result);
            setHistory(prev => [result, ...prev].slice(0, 50));
        }
    }, [mode, length, wordCount, separator, options]);

    // Initial generation
    useEffect(() => {
        handleGenerate();
    }, []);

    // Regenerate when specific options change (length, toggles) 
    // but maybe not mode immediately to avoid jumping too much
    useEffect(() => {
        handleGenerate();
    }, [length, wordCount, separator, options, mode]);

    const deleteHistoryItem = (index: number) => {
        setHistory(prev => prev.filter((_, i) => i !== index));
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainPanel}>
                <PasswordDisplay
                    password={currentPassword}
                    onRegenerate={handleGenerate}
                />
                <SettingsForm
                    mode={mode}
                    setMode={setMode}
                    length={length}
                    setLength={setLength}
                    options={options}
                    setOptions={setOptions}
                    wordCount={wordCount}
                    setWordCount={setWordCount}
                    separator={separator}
                    setSeparator={setSeparator}
                />
            </div>

            <div className={styles.sidePanel}>
                <HistoryList
                    history={history}
                    onDelete={deleteHistoryItem}
                    onClear={clearHistory}
                />
            </div>
        </div>
    );
}
