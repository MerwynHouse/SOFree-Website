export const B = {
  deepOlive:    "#2D5016",
  heroGreen:    "#4A7C2F",
  brightAccent: "#6BA32A",
  softHighlight:"#A8C87A",
  warmSand:     "#E8D5B0",
  baseSand:     "#F5EDD8",
  white:        "#FFFFFF",
  textDark:     "#1A1A1A",
  textMid:      "#444444",
  textLight:    "#888888",
  borderLight:  "#E2D9C8",
  redHigh:      "#C4622D",
  redHighBg:    "#FDF0EB",
  amber:        "#D4882A",
  amberBg:      "#FDF5E8",
};

export const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${B.baseSand}; color: ${B.textDark}; font-family: 'Inter', sans-serif; }
  button { cursor: pointer; border: none; background: none; }
  input, textarea, select { outline: none; }
  a { text-decoration: none; color: inherit; }
  img { max-width: 100%; display: block; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fade-up { animation: fadeUp 0.6s ease both; }
  .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }

  ::selection { background: ${B.softHighlight}; color: ${B.deepOlive}; }
`;
