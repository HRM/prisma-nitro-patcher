#!/usr/bin/env node
import { generatorHandler } from '@prisma/generator-helper';
import { patchPrisma } from './patchPrisma';
import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { PresentableError } from './util';
import { Console } from 'console';
import { stdout } from 'process';
import { parseEnvValue } from '@prisma/internals/dist/utils/parseEnvValue';

generatorHandler({
  onManifest() {
    return {
      prettyName: 'Prisma Client Patcher 🩹',
      defaultOutput: path.join('.', 'node_modules', '.prisma', 'client'),
      requiresGenerators: ['prisma-client-js'],
    };
  },
  async onGenerate(options) {
    try {
      const outputFolder = options.generator.output
        ? parseEnvValue(options.generator.output)
        : path.join('.', 'node_modules', '.prisma', 'client');
      if (outputFolder) {
        const outFilePath = path.join(outputFolder, 'index.d.ts');
        const contents = String(await readFile(outFilePath));
        const patchedContents = patchPrisma(contents);
        await writeFile(outFilePath, patchedContents);
      }
    } catch (e) {
      PresentableError.presentError(e, new Console(stdout, stdout));
      process.exit(1);
    }
  },
});
