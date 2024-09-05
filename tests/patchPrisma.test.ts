import { patchPrisma } from '../src/patchPrisma';
import { readFile } from 'fs/promises';
import path from 'path';
import { expect, describe, it,beforeAll } from '@jest/globals';
import { PresentableError } from '../src/util';

describe('patchPrisma for prisma version 5.19.1', () => {
  const testData = {
    contents:"",
    patchedContents:"",
    incorrectContents: "",
  }
  
  beforeAll(async ()=>{
    const [contents,patchedContents,incorrectContents] = await Promise.all([
      await readFile(
        path.join('.', 'tests', 'files', 'ver-5.19.1', 'index.txt'),
      ),
      await readFile(
        path.join(
          '.',
          'tests',
          'files',
          'ver-5.19.1',
          'index-patched.txt',
        ),
      ),
      await readFile(
        path.join(
          '.',
          'tests',
          'files',
          'ver-5.19.1',
          'index-incorrect.txt',
        ),
      )
    ]);
    testData.contents = String(contents);
    testData.patchedContents = String(patchedContents);
    testData.incorrectContents = String(incorrectContents)
  })

  it('applies a correct patch', async () => {
    expect(testData.patchedContents).toBe(patchPrisma(testData.contents));
  });
  it('throws a error if the input is already patched', ()=>{
      expect.hasAssertions();
      try {
        patchPrisma(testData.patchedContents);
      } catch (e) {
        expect(e).toBeInstanceOf(PresentableError);
        expect((e as Error).message).toBe('This file is already patched');
      }
  });
  it('throws a error if the input is not compatible with patching', ()=>{
    expect.hasAssertions();
    try {
      patchPrisma(testData.incorrectContents);
    } catch (e) {
      expect(e).toBeInstanceOf(PresentableError);
      expect((e as Error).message).toBe('The prisma version or file provided is not compatible with patching');
    }
  });
});
