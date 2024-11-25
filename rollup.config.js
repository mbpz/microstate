import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
    // UMD build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/microstate.umd.js',
            format: 'umd',
            name: 'MicroState',
            exports: 'named',
            sourcemap: true,
            globals: {
                'MicroState': 'MicroState'
            }
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: 'dist/types',
                rootDir: 'src'
            }),
            nodeResolve(),
            commonjs(),
            terser()
        ]
    },
    // ESM build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.esm.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: './dist'
            }),
            nodeResolve(),
            commonjs()
        ]
    },
    // CJS build
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                declaration: true,
                declarationDir: './dist'
            }),
            nodeResolve(),
            commonjs()
        ]
    }
];