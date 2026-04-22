import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import boundaries from 'eslint-plugin-boundaries';
import importPlugin from 'eslint-plugin-import';

import localPlugin from './tools/eslint/local-plugin.mjs';

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTypeScript,
    {
        plugins: {
            boundaries,
            import: importPlugin,
            local: localPlugin
        },
        settings: {
            'boundaries/elements': [
                {
                    type: 'app',
                    pattern: 'app/*',
                    mode: 'folder'
                },
                {
                    type: 'application',
                    pattern: 'application/*',
                    mode: 'folder'
                },
                {
                    type: 'view',
                    pattern: 'views/*',
                    mode: 'folder'
                },
                {
                    type: 'widget',
                    pattern: 'widgets/*',
                    mode: 'folder'
                },
                {
                    type: 'feature',
                    pattern: 'features/*',
                    mode: 'folder'
                },
                {
                    type: 'entity',
                    pattern: 'entities/*',
                    mode: 'folder',
                    capture: ['entityName']
                },
                {
                    type: 'server',
                    pattern: 'server/*',
                    mode: 'folder'
                },
                {
                    type: 'shared',
                    pattern: 'shared/*',
                    mode: 'folder'
                }
            ]
        },
        rules: {
            '@next/next/no-img-element': 'off',
            'boundaries/element-types': [
                'warn',
                {
                    default: 'allow',
                    rules: [
                        {
                            from: 'entity',
                            disallow: [
                                [
                                    'entity',
                                    {
                                        relationship: ['sibling', 'parent', 'child', 'ancestor', 'descendant', 'uncle', 'nephew']
                                    }
                                ]
                            ],
                            message: 'entities 간 직접 import는 금지입니다. shared로 이동하거나 상위 레이어에서 조합하세요.'
                        },
                        {
                            from: ['view', 'widget', 'feature', 'entity', 'shared'],
                            disallow: ['server'],
                            message: 'client 레이어에서는 server 레이어를 import할 수 없습니다.'
                        }
                    ]
                }
            ],
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    pathGroups: [
                        { pattern: 'react', group: 'external', position: 'before' },
                        { pattern: '@/application', group: 'internal', position: 'before' },
                        { pattern: '@/application/**', group: 'internal', position: 'before' },
                        { pattern: '@/server', group: 'internal', position: 'before' },
                        { pattern: '@/server/**', group: 'internal', position: 'before' },
                        { pattern: '@/widgets', group: 'internal', position: 'before' },
                        { pattern: '@/widgets/**', group: 'internal', position: 'before' },
                        { pattern: '@/views', group: 'internal', position: 'before' },
                        { pattern: '@/views/**', group: 'internal', position: 'before' },
                        { pattern: '@/features', group: 'internal', position: 'before' },
                        { pattern: '@/features/**', group: 'internal', position: 'before' },
                        { pattern: '@/entities', group: 'internal', position: 'before' },
                        { pattern: '@/entities/**', group: 'internal', position: 'before' },
                        { pattern: '@/shared', group: 'internal', position: 'before' },
                        { pattern: '@/shared/**', group: 'internal', position: 'before' },
                        { pattern: '@/**', group: 'internal', position: 'after' }
                    ],
                    pathGroupsExcludedImportTypes: ['builtin']
                }
            ],
            'import/no-duplicates': 'warn',
            'import/first': 'warn',
            'local/component-internal-order': 'off'
        }
    },
    {
        files: ['features/**/*.tsx'],
        rules: {
            'local/component-internal-order': 'warn'
        }
    },
    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts'])
]);

export default eslintConfig;
