/**
 * Procedural topographic contours, rendered at build time.
 *
 * Each "peak" is a set of concentric, wobbly closed rings. Every fifth ring is
 * an index contour (drawn heavier), like a real USGS quad.
 */
export interface Peak {
  cx: number;
  cy: number;
  /** Number of rings */
  count: number;
  /** Radius of the innermost ring */
  r0: number;
  /** Radius step between rings */
  dr: number;
  /** Changes the wobble pattern */
  seed: number;
  /** Horizontal / vertical stretch */
  sx?: number;
  sy?: number;
}

function ring(p: Peak, i: number): string {
  const { cx, cy, seed, sx = 1, sy = 1 } = p;
  const r = p.r0 + i * p.dr;
  const steps = 96;
  let d = "";
  for (let k = 0; k <= steps; k++) {
    const t = (k / steps) * Math.PI * 2;
    const rr =
      r *
      (1 +
        0.13 * Math.sin(3 * t + seed + i * 0.22) +
        0.07 * Math.sin(5 * t - seed * 0.7 + i * 0.35) +
        0.04 * Math.sin(2 * t + i * 0.8));
    const x = (cx + rr * Math.cos(t) * sx).toFixed(1);
    const y = (cy + rr * Math.sin(t) * sy).toFixed(1);
    d += `${k ? "L" : "M"}${x} ${y}`;
  }
  return `${d}Z`;
}

/** Returns SVG path data for the regular and index contours of the given peaks. */
export function contours(peaks: Peak[]): { minor: string; index: string } {
  const minor: string[] = [];
  const index: string[] = [];
  for (const p of peaks) {
    for (let i = 0; i < p.count; i++) {
      (i % 5 === 0 ? index : minor).push(ring(p, i));
    }
  }
  return { minor: minor.join(" "), index: index.join(" ") };
}

/** Deterministic pseudo-random number generator (mulberry32) seeded from a string. */
function seeded(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * An elevation profile for a post — the same slug always yields the same ridge.
 * Returns a closed area path in a `width` x `height` box.
 */
export function elevationProfile(slug: string, width = 1440, height = 48): string {
  const rand = seeded(slug);
  const segments = 24;
  let d = `M0 ${height}`;
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    // A gentle ridge that peaks mid-post, plus noise
    const ridge = Math.sin((i / segments) * Math.PI) * 0.55;
    const y = height - (0.12 + ridge * 0.7 + rand() * 0.3) * (height - 6);
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d} L${width} ${height} Z`;
}
