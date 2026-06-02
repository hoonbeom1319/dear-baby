import { readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

import { defineConfig } from 'tsup';

function libEntries() {
    const dir = join('src', 'lib');

    return Object.fromEntries(
        readdirSync(dir)
            .filter((file) => file.endsWith('.ts'))
            .map((file) => [`lib/${basename(file, '.ts')}`, join(dir, file)])
    );
}

export default defineConfig({
    tsconfig: 'tsconfig.json',
    entry: {
        'api/index': 'src/api/index.ts',
        'api/fetch': 'src/api/fetch.ts',
        ...libEntries()
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true
});
