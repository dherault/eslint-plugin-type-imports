import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'

import { enforceConsistentTypeKeywordInImports } from './enforce-consistent-type-keyword-in-imports'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

describe('enforce-consistent-type-keyword-in-imports', () => {
  ruleTester.run(`Enforce consistent usage of TypeScript type keyword in imports`, enforceConsistentTypeKeywordInImports, {
    valid: [
      {
        code: 'import { a } from "module"',
      },
      {
        code: 'import { a, b } from "module"',
      },
      {
        code: 'import type { A } from "module"',
      },
      {
        code: 'import type { A, B } from "module"',
      },
      {
        code: 'import { a, type A } from "module"',
      },
      {
        code: 'import { a, b, type A } from "module"',
      },
      {
        code: 'import { a, type A, type B } from "module"',
      },
      {
        code: 'import { a, b, type A, type B } from "module"',
      },
    ],
    invalid: [
      {
        code: 'import { type A } from "module"',
        errors: [{ messageId: 'extractTypeKeyword' }],
        output: 'import type { A } from "module"',
      },
      {
        code: 'import { type A, type B } from "module"',
        errors: [{ messageId: 'extractTypeKeyword' }],
        output: 'import type { A, B } from "module"',
      },
      {
        code: 'import { type A, type B, type C } from "module"',
        errors: [{ messageId: 'extractTypeKeyword' }],
        output: 'import type { A, B, C } from "module"',
      },
    ],
  })
})
