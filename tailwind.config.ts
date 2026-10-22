import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F26A21",
          hover: "#D95614",
          light: "#FFF1E8",
        },
        brand: {
          orange: "#F26A21",
          orangeHover: "#D95614",
          orangeLight: "#FFF1E8",
          bgGray: "#F5F6F8",
          borderGray: "#E5E7EB",
          mutedGray: "#9CA3AF",
          textGray: "#4B5563",
          headingGray: "#1F2937",
          darkGray: "#111827",
        },
      },
      fontFamily: {
        thai: [
          "'IBM Plex Sans Thai'",
          "'Noto Sans Thai'",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(17, 24, 39, 0.06), 0 1px 4px -1px rgba(17, 24, 39, 0.04)",
        cardHover: "0 10px 25px -5px rgba(242, 106, 33, 0.12), 0 8px 10px -6px rgba(17, 24, 39, 0.06)",
        modal: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        theme: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
