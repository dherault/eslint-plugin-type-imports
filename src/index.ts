import { enforceConsistentTypeKeywordInImports } from './rules/enforce-consistent-type-keyword-in-imports'
import type {Config} from 'eslint/config'

type ConfigurationName = 'recommended'

const plugin = {
  meta: {
    name: 'eslint-plugin-type-imports',
    version: '1.0.0',
  },
  rules: {
    'enforce-consistent-type-keyword-in-imports': enforceConsistentTypeKeywordInImports,
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
    },
  },
})

export default plugin
