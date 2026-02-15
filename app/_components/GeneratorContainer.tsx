"use client";

import { useState, useEffect, useCallback } from "react";
import PasswordDisplay from "./PasswordDisplay";
import SettingsForm, { GenerationMode } from "./SettingsForm";
import {
    generateRandom,
    generateMemorable,
    generatePIN,
    PasswordResult
} from "../_data/generator";
import styles from "./GeneratorContainer.module.css";

export default function GeneratorContainer({ dictionary }: { dictionary: any }) {
    const dict = dictionary;
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

    return (
        <div className={styles.container}>
            <div className={styles.mainPanel}>
                <PasswordDisplay
                    password={currentPassword}
                    onRegenerate={handleGenerate}
                    dictionary={dict}
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
                    dictionary={dict}
                />
            </div>
        </div>
    );
}
