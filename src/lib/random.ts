export function cryptoRandomInt(maxExclusive: number) {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
    throw new Error("maxExclusive doit être > 0");
  }

  if (typeof crypto === "undefined" || !crypto.getRandomValues) {
    return Math.floor(Math.random() * maxExclusive);
  }

  const maxUint32 = 0xffffffff;
  const limit = Math.floor((maxUint32 + 1) / maxExclusive) * maxExclusive;
  const buf = new Uint32Array(1);

  while (true) {
    crypto.getRandomValues(buf);
    const n = buf[0];
    if (n < limit) return n % maxExclusive;
  }
}

export function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = cryptoRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
