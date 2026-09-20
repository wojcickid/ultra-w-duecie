// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Adres MVP do potwierdzenia; jedyne miejsce z domeną, linki wewnętrzne są względne.
  site: 'https://korona.damianwojcicki.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
