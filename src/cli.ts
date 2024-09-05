#!/usr/bin/env node
import { patchPrisma } from './patchPrisma';
import path from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { PresentableError } from './util';

function getIndexOfParamName(argv: string[], name: string | string[]) {
  const names = Array.isArray(name) ? name : [name];
  return argv.findIndex((p) => names.some((name) => p == name));
}

function getStringParam(
  argv: string[],
  name: string | string[],
): string | undefined {
  const index = getIndexOfParamName(argv, name);
  if (index >= 0 && index + 1 < argv.length) {
    return argv[index + 1];
  }
}

if (getIndexOfParamName(process.argv, ['--help', '-h']) >= 0) {
  console.log(`
Run this command to patch the extension speed up into your prisma client.

    --help | -h : prints this help message
    --path | -p : path to the generated prisma directory
`);
} else {
  try {
    const prismaPath = path.join(
      getStringParam(process.argv, ['--path', '-p']) ??
        path.join('.', 'node_modules', '.prisma', 'client'),
      'index.d.ts',
    );

    console.log(`patching ${prismaPath} 🛠️`);

    const contents = String(readFileSync(prismaPath));
    const patchedContent = patchPrisma(contents);
    writeFileSync(prismaPath, patchedContent);

    console.log(`patching was successfull ✔️`);
  } catch (e) {
    PresentableError.presentError(e);
  }
}
