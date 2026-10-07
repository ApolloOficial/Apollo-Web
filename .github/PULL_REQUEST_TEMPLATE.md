#### Descrição
<!-- Escreva uma breve explicação do que foi feito na branch -->

---

#### Tipo de alteração
<!--
Apague as opções que não se aplicam a esse PR e preencha a descrição ao lado da que você manteve:

feat: Adição de uma nova funcionalidade
fix: Correção de um bug
docs: Alteração apenas de documentação (README, comentários, etc.)
style: Formatação, espaçamento, ponto e vírgula — sem mudança de lógica
refactor: Reestruturação de código que não corrige bug nem adiciona funcionalidade
perf: Alteração que melhora performance
test: Adição ou correção de testes
build: Mudanças que afetam o build ou dependências externas (ex: package.json)
ci: Mudanças em arquivos e scripts de configuração de CI
chore: Tarefas de manutenção que não alteram código de produção (ex: configs, scripts)
revert: Reversão de um commit anterior
-->
`x`: descrição

---

#### Checklist
<!-- Preencha com ✅ ou ❌-->
- [ ] Testei localmente (Spring rodando + front, fluxo completo)
- [ ] Segue a convenção de nomenclatura do projeto (`Dto`/`ViewModel` nos types, arquivos em `src/types/` e `src/services/`)
- [ ] Toda comunicação com a API está isolada em `src/services/`, com try/catch e retorno tipado
- [ ] Estados de loading e erro tratados visualmente (sem `alert()` nem `console.log()` como único tratamento)
- [ ] Erros no DOM usam `role="alert"`
- [ ] Inputs têm `label` associado via `htmlFor`, e imagens/ícones decorativos têm `alt=""`
- [ ] Testei a navegação só pelo teclado (sem mouse) nessa tela
- [ ] Commits seguem Conventional Commits (`feat:`, `fix:`, `refactor:`, etc.), sem mensagens genéricas

---

#### Observações
<!-- Preencha apenas se necessário, caso não for, delete o título Observações -->