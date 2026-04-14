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

Enforces that type imports use the `type` keyword outside of curly braces.

**Bad:**
```typescript
import { type User } from './types'
```

**Good:**
```typescript
import type { User } from './types'
```

## License

MIT
