import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'bin/cursor-companion.ts',
  output: {
    file: 'dist/bin/cursor-companion.js',
    format: 'esm',
  },
  plugins: [typescript({ tsconfig: './tsconfig.json' }), nodeResolve()],
  external: ['commander', 'chalk', 'enquirer', 'fs-extra'], // external dependencies
};
