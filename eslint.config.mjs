import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            '@next/next/no-img-element': 'off',
            '@next/next/no-html-link-for-pages': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            'react-hooks/set-state-in-effect': 'warn'
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
