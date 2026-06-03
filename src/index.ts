import { enforceConsistentTypeKeywordInImports } from './rules/enforce-consistent-type-keyword-in-imports'
import { preventDuplicateImports } from './rules/prevent-duplicate-imports'
import type {Config} from 'eslint/config'

type ConfigurationName = 'recommended'

const plugin = {
  meta: {
    name: 'eslint-plugin-type-imports',
    version: '1.0.0',
  },
  rules: {
    'enforce-consistent-type-keyword-in-imports': enforceConsistentTypeKeywordInImports,
    'prevent-duplicate-imports': preventDuplicateImports,
  },
  configs: {} as Record<ConfigurationName, Config>,
}

Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      'type-imports': plugin,
    },
    rules: {
      'type-imports/enforce-consistent-type-keyword-in-imports': 'error',
      'type-imports/prevent-duplicate-imports': 'error',
    },
  },
})

export default plugin
