# eslint-plugin-type-imports

An ESLint plugin to enforce consistent usage of TypeScript type imports.

## Installation

```bash
npm install --save-dev eslint-plugin-type-imports
```

## Configuration

Add the plugin to your ESLint config (`eslint.config.js`):

```javascript
import typeImports from 'eslint-plugin-type-imports'

export default [
  // ... other configs
  typeImports.configs.recommended,
]
```

## Rules

### `enforce-consistent-type-keyword-in-imports`

Enforces that type imports use the `type` keyword outside of curly braces rather than inline on each specifier.

**Bad:**
```typescript
import { type User } from './types'
import { type User, type Post } from './types'
```

**Good:**
```typescript
import type { User } from './types'
import type { User, Post } from './types'
```

---

### `prevent-duplicate-imports`

Prevents multiple import statements from the same package or path. The auto-fix merges them into a single import.

**Bad:**
```typescript
import { a } from './utils'
import { b } from './utils'
```

**Good:**
```typescript
import { a, b } from './utils'
```

Type imports are handled correctly:

```typescript
// Two type-only imports are merged with the type keyword preserved
import type { A } from './types'
import type { B } from './types'
// → import type { A, B } from './types'

// Mixed value and type imports are merged with inline type specifiers
import { a } from './utils'
import type { B } from './utils'
// → import { a, type B } from './utils'
```

Default imports are merged with named imports:

```typescript
import def from './module'
import { a } from './module'
// → import def, { a } from './module'
```

> **Note:** Namespace imports (`import * as ns`) and side-effect imports (`import './module'`) are excluded from this rule and left as-is.

## License

MIT
