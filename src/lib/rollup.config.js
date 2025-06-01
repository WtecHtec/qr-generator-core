import typescript from '@rollup/plugin-typescript';

export default {
  input: 'index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
  external: ['qr-code-styling']
}; 