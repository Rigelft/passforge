import { cryptoRandomInt, shuffleInPlace } from "@/lib/random";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
export const DEFAULT_SYMBOLS = "!@#$%^&*()_+{}[]|:;<>,.?/~";
const AMBIGUOUS = "O0Il1";

export type PasswordOptions = {
  length: number;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
  ensureEachSelectedType: boolean;
  symbols: string;
};

function uniqChars(input: string) {
  return Array.from(new Set(input.split(""))).join("");
}

function removeChars(input: string, toRemove: string) {
  const removeSet = new Set(toRemove.split(""));
  return input
    .split("")
    .filter((c) => !removeSet.has(c))
    .join("");
}

function pickOne(from: string) {
  return from.charAt(cryptoRandomInt(from.length));
}

export function getEffectiveCharsets(opts: PasswordOptions) {
  const symbols = uniqChars(opts.symbols.trim() ? opts.symbols : DEFAULT_SYMBOLS);

  const lower = opts.excludeAmbiguous ? removeChars(LOWER, AMBIGUOUS) : LOWER;
  const upper = opts.excludeAmbiguous ? removeChars(UPPER, AMBIGUOUS) : UPPER;
  const digits = opts.excludeAmbiguous ? removeChars(DIGITS, AMBIGUOUS) : DIGITS;
  const sym = opts.excludeAmbiguous ? removeChars(symbols, AMBIGUOUS) : symbols;

  return { lower, upper, digits, sym };
}

export function generatePassword(opts: PasswordOptions) {
  const length = Math.max(8, Math.min(64, Math.floor(opts.length)));
  const { lower, upper, digits, sym } = getEffectiveCharsets(opts);

  const selectedSets: { key: string; chars: string }[] = [{ key: "lower", chars: lower }];
  if (opts.includeUppercase) selectedSets.push({ key: "upper", chars: upper });
  if (opts.includeNumbers) selectedSets.push({ key: "digits", chars: digits });
  if (opts.includeSymbols) selectedSets.push({ key: "sym", chars: sym });

  for (const s of selectedSets) {
    if (s.chars.length === 0) throw new Error(`Jeu de caractères vide (${s.key}).`);
  }

  const all = selectedSets.map((s) => s.chars).join("");
  if (!all.length) throw new Error("Aucun jeu de caractères sélectionné.");

  const out: string[] = [];
  if (opts.ensureEachSelectedType) {
    for (const s of selectedSets) out.push(pickOne(s.chars));
  }

  while (out.length < length) out.push(pickOne(all));
  shuffleInPlace(out);

  return {
    value: out.join(""),
    charsetSize: uniqChars(all).length,
    length,
  };
}

export function estimateEntropyBits(length: number, charsetSize: number) {
  if (length <= 0 || charsetSize <= 1) return 0;
  return length * Math.log2(charsetSize);
}

export function strengthFromEntropy(bits: number) {
  if (bits < 45) return { label: "Faible", tone: "danger" as const, percent: Math.min(100, (bits / 90) * 100) };
  if (bits < 75) return { label: "Moyen", tone: "warning" as const, percent: Math.min(100, (bits / 90) * 100) };
  return { label: "Fort", tone: "success" as const, percent: Math.min(100, (bits / 90) * 100) };
}
