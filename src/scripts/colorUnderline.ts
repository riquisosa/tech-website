// Randomly assigns one of Flexoki's 8 accent hues to every link's underline
// color, re-randomizing on hover — adapted from Cassidy Williams' "blahg"
// ColorScript.astro, using Flexoki's palette instead of 4 hardcoded hex values.
//
// Flexoki spec: light themes use each hue's 600 value, dark themes use 400.
// https://stephango.com/flexoki

const LIGHT_COLORS = [
  "#AF3029", // red-600
  "#BC5215", // orange-600
  "#AD8301", // yellow-600
  "#66800B", // green-600
  "#24837B", // cyan-600
  "#205EA6", // blue-600
  "#5E409D", // purple-600
  "#A02F6F", // magenta-600
];

const DARK_COLORS = [
  "#D14D41", // red-400
  "#DA702C", // orange-400
  "#D0A215", // yellow-400
  "#879A39", // green-400
  "#3AA99F", // cyan-400
  "#4385BE", // blue-400
  "#8B7EC8", // purple-400
  "#CE5D97", // magenta-400
];

function getColorPool(): string[] {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return isDark ? DARK_COLORS : LIGHT_COLORS;
}

function getRandomColor(): string {
  const pool = getColorPool();
  return pool[Math.floor(Math.random() * pool.length)];
}

function setRandomLinkColors(): void {
  document.querySelectorAll<HTMLAnchorElement>("a").forEach(el => {
    el.style.textDecorationColor = getRandomColor();
  });

  // Tag pills fake their underline with a dashed border-bottom instead of
  // real text-decoration, so setting textDecorationColor above does
  // nothing visible for them — they need their border colored directly.
  document.querySelectorAll<HTMLElement>(".tag-pill").forEach(el => {
    el.style.borderBottomColor = getRandomColor();
  });

  // The wavy "currently active" indicator under Archives/Search is a
  // decorative SVG icon, not real text, so text-decoration-color can't
  // touch it either — style its shapes directly. Covers whichever shape
  // elements the icon actually uses, and also sets color in case any
  // path relies on fill="currentColor" rather than an explicit fill.
  document.querySelectorAll<HTMLElement>(".nav-underline-icon").forEach(el => {
    const color = getRandomColor();
    el.style.color = color;
    el
      .querySelectorAll<SVGElement>("path, circle, rect, line, polyline, ellipse")
      .forEach(shape => {
        shape.style.fill = color;
        shape.style.stroke = color;
      });
  });
}

function attachHoverListeners(): void {
  document.querySelectorAll<HTMLElement>("a, button").forEach(el => {
    el.addEventListener("mouseover", setRandomLinkColors);
  });
}

function init(): void {
  setRandomLinkColors();
  attachHoverListeners();
}

init();

// Re-run after Astro View Transitions navigation — without this, links
// would only ever get colored once, on the very first page load, since
// ClientRouter swaps the DOM without a full page reload.
document.addEventListener("astro:after-swap", init);

// Re-color immediately when the theme toggles (light <-> dark), so the
// pool switches from Flexoki's 600 values to its 400 values correctly.
// Watches the same data-theme attribute theme.ts sets — no direct
// coupling to the toggle button itself.
new MutationObserver(() => setRandomLinkColors()).observe(
  document.documentElement,
  { attributes: true, attributeFilter: ["data-theme"] }
);
