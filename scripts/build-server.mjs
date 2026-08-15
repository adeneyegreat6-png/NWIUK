import { build } from 'esbuild';

// Bundle the Express server into a single standalone CommonJS file.
// Vite is only used as dev middleware, so it's excluded from the prod bundle.
await build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  outfile: 'dist/server.cjs',
  // vite is dev-only; @google/genai is loaded lazily and kept external so it
  // resolves from node_modules at runtime rather than being inlined.
  external: ['vite', '@google/genai'],
  logLevel: 'info',
});

console.log('✅ Server bundled to dist/server.cjs');
