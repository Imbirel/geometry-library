import { defineConfig } from 'vitest/config';
import { transformSync } from '@swc/core';
import type { Plugin } from 'vitest/config';

function swcPlugin(): Plugin {
  return {
    name: 'swc-transformer',
    async transform(code: string, id: string) {
      if (!id.endsWith('.ts')) return;

      const result = transformSync(code, {
        filename: id,
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
          },
          transform: {
            decoratorVersion: '2022-03',
          },
          target: 'es2022',
        },
        module: {
          type: 'es6',
        },
        sourceMaps: true,
      });

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}

export default defineConfig({
  plugins: [swcPlugin()],
  oxc: false,
});
