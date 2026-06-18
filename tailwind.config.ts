import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: { navy: '#07111f', ink: '#0f172a', blue: '#2563eb', green: '#16a34a', gold: '#f59e0b' } },
      boxShadow: { soft: '0 18px 50px rgba(15, 23, 42, 0.12)' }
    }
  },
  plugins: []
};
export default config;
