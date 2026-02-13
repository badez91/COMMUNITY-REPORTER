let config;

try {
  config = {
    plugins: {
      "@tailwindcss/postcss": {},
    },
  };
} catch (error) {
  console.error("PostCSS configuration error:", error);
  config = { plugins: {} };
}

export default config;
