import { ADJECTIVES, NOUNS } from "./wordlists";

export type PasswordStrength = "Low" | "Medium" | "High";

export interface PasswordResult {
    value: string;
    strength: PasswordStrength;
    entropy: number;
}

const CHAR_SETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

/**
 * Generates an array of random bytes using window.crypto
 */
function getRandomBytes(count: number): Uint8Array {
    const bytes = new Uint8Array(count);
    window.crypto.getRandomValues(bytes);
    return bytes;
}

/**
 * Calculates entropy and strength
 */
export function calculateStrength(value: string, poolSize: number): { strength: PasswordStrength; entropy: number } {
    if (!value) return { strength: "Low", entropy: 0 };
    const entropy = Math.round(value.length * Math.log2(poolSize));

    let strength: PasswordStrength = "Low";
    if (entropy >= 80) strength = "High";
    else if (entropy >= 50) strength = "Medium";

    return { strength, entropy };
}

/**
 * Random Mode Generator
 */
export function generateRandom(
    length: number,
    options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): PasswordResult {
    let pool = "";
    if (options.uppercase) pool += CHAR_SETS.uppercase;
    if (options.lowercase) pool += CHAR_SETS.lowercase;
    if (options.numbers) pool += CHAR_SETS.numbers;
    if (options.symbols) pool += CHAR_SETS.symbols;

    if (pool.length === 0) return { value: "", strength: "Low", entropy: 0 };

    const randomBytes = getRandomBytes(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        result += pool.charAt(randomBytes[i] % pool.length);
    }

    const { strength, entropy } = calculateStrength(result, pool.length);
    return { value: result, strength, entropy };
}

/**
 * Memorable Mode Generator
 */
export function generateMemorable(
    wordCount: number,
    separator: string
): PasswordResult {
    const bytes = getRandomBytes(wordCount * 2 + 1); // 2 words per byte request + 1 for number
    let resultParts: string[] = [];

    for (let i = 0; i < wordCount; i++) {
        const adj = ADJECTIVES[bytes[i] % ADJECTIVES.length];
        const noun = NOUNS[bytes[i + wordCount] % NOUNS.length];
        resultParts.push(`${adj}${separator}${noun}`);
    }

    const randomNumber = (bytes[bytes.length - 1] % 999).toString().padStart(3, "0");
    const finalValue = resultParts.join(separator) + separator + randomNumber;

    // Pool size estimation for memorable: adjectives (32) * nouns (32) + 1000 numbers
    // This is a simplified entropy calculation for passphrases
    const totalCombinations = Math.pow(ADJECTIVES.length * NOUNS.length, wordCount) * 1000;
    const entropy = Math.round(Math.log2(totalCombinations));

    let strength: PasswordStrength = "Low";
    if (entropy >= 70) strength = "High";
    else if (entropy >= 40) strength = "Medium";

    return { value: finalValue, strength, entropy };
}

/**
 * PIN Mode Generator
 */
export function generatePIN(length: number): PasswordResult {
    const bytes = getRandomBytes(length);
    let result = "";
    for (let i = 0; i < length; i++) {
        result += (bytes[i] % 10).toString();
    }

    const { strength, entropy } = calculateStrength(result, 10);
    return { value: result, strength, entropy };
}
