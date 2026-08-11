import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // next-themes toggles a `dark` class on <html>
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // backed by CSS variables defined in globals.css — this is what
        // makes bg-bg / text-text / border-border automatically re-theme
        // when the `dark` class toggles.
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface-2)",
        text: "var(--text)",
        "text-soft": "var(--text-soft)",
        border: "var(--border)",
        manila: "var(--manila)",
        accent: "var(--accent)",
        "stamp-applied": "var(--stamp-applied)",
        "stamp-interview": "var(--stamp-interview)",
        "stamp-offer": "var(--stamp-offer)",
        "stamp-rejected": "var(--stamp-rejected)",
      },
      fontFamily: {
        mono: ["var(--font-space-mono)", "monospace"],
        body: ["var(--font-work-sans)", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px var(--shadow)",
        "card-hover": "0 4px 10px var(--shadow)",
        pop: "8px 8px 0 var(--manila-deep, var(--manila))",
      },
      borderRadius: {
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};

export default config;
