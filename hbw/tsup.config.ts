import { defineConfig } from 'tsup';

export default defineConfig({
    tsconfig: 'tsconfig.json',
    entry: ['api/*.ts', 'lib/*.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true
});
