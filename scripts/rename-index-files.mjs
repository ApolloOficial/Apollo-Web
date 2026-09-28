import { existsSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const root = resolve(args.find((arg) => !arg.startsWith('--')) ?? 'src')
const sourceRoot = root

function toPascalCase(folderName) {
  return folderName
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function isEmpty(filePath) {
  return statSync(filePath).size === 0
}

function collectDirectories(directory, found = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'node_modules') continue
    const fullPath = join(directory, entry.name)
    found.push(fullPath)
    collectDirectories(fullPath, found)
  }
  return found
}

function moveFile(from, to, report) {
  if (existsSync(to)) {
    if (!isEmpty(to)) {
      report.skipped.push(`${to} já existe e tem conteúdo — ${from} não foi movido`)
      return false
    }
    if (!isDryRun) unlinkSync(to)
    report.replacedEmpty.push(to)
  }
  if (!isDryRun) renameSync(from, to)
  report.moved.push(`${from}  →  ${to}`)
  return true
}

function buildBarrel(componentPath, componentName) {
  if (isEmpty(componentPath)) return ''
  const content = readFileSync(componentPath, 'utf8')
  if (/export\s+default\s/.test(content)) return `export { default } from './${componentName}'\n`
  return `export * from './${componentName}'\n`
}

const report = { moved: [], replacedEmpty: [], barrels: [], skipped: [], leftovers: [] }

for (const directory of collectDirectories(sourceRoot)) {
  const folderName = directory.split(/[\\/]/).pop()
  const name = toPascalCase(folderName)
  const indexTsx = join(directory, 'index.tsx')
  const indexCss = join(directory, 'index.css')
  const namedTsx = join(directory, `${name}.tsx`)
  const namedCss = join(directory, `${name}.css`)
  const barrel = join(directory, 'index.ts')

  if (!existsSync(indexTsx)) {
    if (existsSync(indexCss)) report.leftovers.push(`${indexCss} — pasta sem componente index.tsx`)
    continue
  }

  const movedTsx = moveFile(indexTsx, namedTsx, report)
  if (!movedTsx) continue

  if (existsSync(indexCss)) moveFile(indexCss, namedCss, report)

  const tsxToEdit = isDryRun ? indexTsx : namedTsx
  if (!isDryRun && !isEmpty(tsxToEdit)) {
    const original = readFileSync(tsxToEdit, 'utf8')
    const updated = original.replace(/(['"])\.\/index\.css\1/g, `$1./${name}.css$1`)
    if (updated !== original) writeFileSync(tsxToEdit, updated)
  }

  if (!existsSync(barrel)) {
    const barrelContent = isDryRun ? '' : buildBarrel(namedTsx, name)
    if (!isDryRun) writeFileSync(barrel, barrelContent)
    report.barrels.push(`${barrel}${barrelContent ? `  →  ${barrelContent.trim()}` : '  (vazio)'}`)
  }
}

const mode = isDryRun ? 'SIMULAÇÃO (nada foi alterado)' : 'CONCLUÍDO'
console.log(`\n${mode}: ${root}\n`)
console.log(`Arquivos renomeados: ${report.moved.length}`)
for (const line of report.moved) console.log(`  ${line}`)
if (report.replacedEmpty.length) {
  console.log(`\nArquivos vazios antigos substituídos: ${report.replacedEmpty.length}`)
  for (const line of report.replacedEmpty) console.log(`  ${line}`)
}
console.log(`\nindex.ts criados: ${report.barrels.length}`)
for (const line of report.barrels) console.log(`  ${line}`)
if (report.leftovers.length) {
  console.log(`\nSobras sem componente (não alteradas): ${report.leftovers.length}`)
  for (const line of report.leftovers) console.log(`  ${line}`)
}
if (report.skipped.length) {
  console.log(`\nATENÇÃO — não movidos: ${report.skipped.length}`)
  for (const line of report.skipped) console.log(`  ${line}`)
}
console.log('')
