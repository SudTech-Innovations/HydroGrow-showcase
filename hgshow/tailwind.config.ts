/** @type {import('tailwindcss').Config} */
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary, #5BE3A8)",
        secondary: "var(--color-secondary, #08172B)",
        link: "var(--color-link, #5BE3A8)",
      },
    },
  },
};

export default config;
