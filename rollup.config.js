import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD 构建 (用于浏览器直接引入)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/log-panel.umd.js',
      format: 'umd',
      name: 'LogPanel',
      sourcemap: !production
    },
    plugins: [
      resolve(),
      postcss({
        inject: true,
        minimize: production
      }),
      production && terser()
    ]
  },
  // ES 模块构建
  {
    input: 'src/index.js',
    output: {
      file: 'dist/log-panel.esm.js',
      format: 'es',
      sourcemap: !production
    },
    plugins: [
      resolve(),
      postcss({
        inject: true,
        minimize: production
      }),
      production && terser()
    ]
  },
  // CommonJS 构建
  {
    input: 'src/index.js',
    output: {
      file: 'dist/log-panel.js',
      format: 'cjs',
      sourcemap: !production,
      exports: 'named'
    },
    plugins: [
      resolve(),
      postcss({
        inject: true,
        minimize: production
      }),
      production && terser()
    ]
  }
];

