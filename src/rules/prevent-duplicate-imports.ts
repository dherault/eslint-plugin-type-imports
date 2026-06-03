import type { Rule } from 'eslint'

export const preventDuplicateImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent multiple import statements from the same package/location',
      recommended: true,
      url: 'https://github.com/dherault/eslint-plugin-type-imports',
    },
    fixable: 'code',
    schema: [],
    messages: {
      duplicateImport: 'Multiple imports from "{{source}}" should be merged into a single import statement',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      Program(programNode) {
        const importsBySource = new Map<string, any[]>()

        for (const node of programNode.body) {
          if (node.type !== 'ImportDeclaration') continue
          if (node.specifiers.some((s: any) => s.type === 'ImportNamespaceSpecifier')) continue
          if (node.specifiers.length === 0) continue

          const source = node.source.value as string
          if (!importsBySource.has(source)) importsBySource.set(source, [])
          importsBySource.get(source)!.push(node)
        }

        for (const [source, imports] of importsBySource) {
          if (imports.length < 2) continue

          context.report({
            node: imports[1],
            messageId: 'duplicateImport',
            data: { source },
            fix(fixer) {
              const allTypeOnly = imports.every((imp: any) => imp.importKind === 'type')
              const sourceRaw = imports[0].source.raw as string

              let defaultSpecifier: string | null = null
              const namedSpecifiers: string[] = []

              for (const importNode of imports) {
                const isTypeOnlyImport = (importNode as any).importKind === 'type'

                for (const specifier of importNode.specifiers) {
                  const s = specifier as any

                  if (s.type === 'ImportDefaultSpecifier') {
                    defaultSpecifier = s.local.name
                  }
                  else if (s.type === 'ImportSpecifier') {
                    const imported = s.imported.name
                    const local = s.local.name
                    let text = imported !== local ? `${imported} as ${local}` : imported

                    if (!allTypeOnly && (isTypeOnlyImport || s.importKind === 'type')) {
                      text = `type ${text}`
                    }

                    namedSpecifiers.push(text)
                  }
                }
              }

              let mergedImport = 'import '
              if (allTypeOnly) mergedImport += 'type '

              if (defaultSpecifier && namedSpecifiers.length > 0) {
                mergedImport += `${defaultSpecifier}, { ${namedSpecifiers.join(', ')} }`
              }
              else if (namedSpecifiers.length > 0) {
                mergedImport += `{ ${namedSpecifiers.join(', ')} }`
              }
              else if (defaultSpecifier) {
                mergedImport += defaultSpecifier
              }

              mergedImport += ` from ${sourceRaw}`

              const fullSource = sourceCode.getText()
              const fixes: Rule.Fix[] = [fixer.replaceText(imports[0], mergedImport)]

              for (let i = 1; i < imports.length; i++) {
                const node = imports[i]
                let start = node.range![0]
                if (start > 0 && fullSource[start - 1] === '\n') start--
                fixes.push(fixer.removeRange([start, node.range![1]]))
              }

              return fixes
            },
          })
        }
      },
    }
  },
}
