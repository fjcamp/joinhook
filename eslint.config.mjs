import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            '@next/next/no-img-element': 'off',
            '@next/next/no-html-link-for-pages': 'off',
            '@typescript-eslint/no-explicit-any': 'warn'
        }
    },
    {
        files: [
            'src/components/ThemeToggle.tsx',
            'src/features/local/**/*.ts',
            'src/features/local/**/*.tsx',
            'src/pages/agent-center.tsx',
            'src/pages/app/control-gastronomico-express.tsx'
        ],
        rules: {
            'react-hooks/set-state-in-effect': 'warn'
        }
    },
    {
        files: ['scripts/browser-qa.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off'
        }
    },
    {
        ignores: [
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
            'scripts/browser-qa.cjs'
        ]
    }
];

export default eslintConfig;
