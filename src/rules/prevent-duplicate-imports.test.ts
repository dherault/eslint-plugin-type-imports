import { RuleTester } from 'eslint'
import * as tsParser from '@typescript-eslint/parser'

import { preventDuplicateImports } from './prevent-duplicate-imports'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
})

describe('prevent-duplicate-imports', () => {
  ruleTester.run('Prevent multiple import statements from the same package/location', preventDuplicateImports, {
    valid: [
      {
        code: 'import { a } from "module"',
      },
      {
        code: 'import type { A } from "module"',
      },
      {
        code: 'import { a } from "module"\nimport { b } from "other"',
      },
      {
        code: 'import * as ns from "module"\nimport { a } from "module"',
      },
      {
        code: 'import "module"\nimport { a } from "module"',
      },
    ],
    invalid: [
      // Two named value imports
      {
        code: 'import { a } from "module"\nimport { b } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { a, b } from "module"',
      },
      // Three named value imports
      {
        code: 'import { a } from "module"\nimport { b } from "module"\nimport { c } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { a, b, c } from "module"',
      },
      // Two type-only imports
      {
        code: 'import type { A } from "module"\nimport type { B } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import type { A, B } from "module"',
      },
      // Mixed value + type-only import
      {
        code: 'import { a } from "module"\nimport type { B } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { a, type B } from "module"',
      },
      // Mixed type-only + value import (reversed order)
      {
        code: 'import type { A } from "module"\nimport { b } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { type A, b } from "module"',
      },
      // Two imports with inline type specifiers
      {
        code: 'import { type A } from "module"\nimport { type B } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { type A, type B } from "module"',
      },
      // Inline type + value specifiers
      {
        code: 'import { type A } from "module"\nimport { b } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { type A, b } from "module"',
      },
      // With aliases
      {
        code: 'import { a as x } from "module"\nimport { b } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { a as x, b } from "module"',
      },
      // Default + named
      {
        code: 'import def from "module"\nimport { a } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import def, { a } from "module"',
      },
      // Non-consecutive imports from same source
      {
        code: 'import { a } from "module"\nimport { b } from "other"\nimport { c } from "module"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { a, c } from "module"\nimport { b } from "other"',
      },
      // Only affects the duplicate source, not others
      {
        code: 'import { a } from "module"\nimport { b } from "module"\nimport { x } from "other"',
        errors: [{ messageId: 'duplicateImport' }],
        output: 'import { a, b } from "module"\nimport { x } from "other"',
      },
    ],
  })
})
