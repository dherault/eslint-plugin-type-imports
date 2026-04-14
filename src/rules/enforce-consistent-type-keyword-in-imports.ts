import type { Rule } from 'eslint'

export const enforceConsistentTypeKeywordInImports: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent usage of TypeScript type keyword in imports',
      recommended: true,
      url: 'https://github.com/dherault/eslint-plugin-type-imports',
    },
    fixable: 'code',
    schema: [
      {
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
    ],
    messages: {
      extractTypeKeyword: 'Type imports should keep type keyword outside of the curly braces',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      ImportDeclaration(node) {
        if ((node as { importKind?: string }).importKind === 'type') {
          return
        }

        const namedSpecifiers = node.specifiers.filter(
          (specifier) => specifier.type === 'ImportSpecifier',
        )

        if (namedSpecifiers.length === 0) {
          return
        }

        if (namedSpecifiers.length !== node.specifiers.length) {
          return
        }

        const allNamedSpecifiersAreTypeImports = namedSpecifiers.every(
          (specifier) => (specifier as { importKind?: string }).importKind === 'type',
        )

        if (!allNamedSpecifiersAreTypeImports) {
          return
        }

        context.report({
          node,
          messageId: 'extractTypeKeyword',
          fix(fixer) {
            const importText = sourceCode.getText(node)
            const openBraceIndex = importText.indexOf('{')
            const closeBraceIndex = importText.lastIndexOf('}')

            if (openBraceIndex === -1 || closeBraceIndex === -1 || closeBraceIndex < openBraceIndex) {
              return null
            }

            const beforeBrace = importText.slice(0, openBraceIndex)
            const insideBraces = importText.slice(openBraceIndex + 1, closeBraceIndex)
            const afterBrace = importText.slice(closeBraceIndex + 1)

            const fixedBeforeBrace = beforeBrace.replace(/^import\s+/, 'import type ')
            const fixedInsideBraces = insideBraces.replace(/\btype\s+/g, '')

            return fixer.replaceText(node, `${fixedBeforeBrace}{${fixedInsideBraces}}${afterBrace}`)
          },
        })
      },
    }
  },
}
