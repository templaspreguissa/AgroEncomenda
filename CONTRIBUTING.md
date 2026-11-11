# Como contribuir

Obrigado pelo interesse em melhorar o AgroEncomenda. O projeto está na fase de protótipo acadêmico; as contribuições devem indicar claramente o que é simulação e o que passa a funcionar de fato.

## Relatar um problema

Abra uma issue no repositório, se o recurso estiver habilitado, com:

- Uma descrição objetiva do problema.
- Passos para reproduzir, usando dados fictícios.
- Resultado esperado e resultado observado.
- Navegador, tamanho aproximado da tela e capturas, quando úteis.

## Propor uma alteração

1. Faça um fork e clone sua cópia do repositório.
2. Crie uma branch com um nome descritivo, como `docs/guia-instalacao` ou `fix/validacao-pedido`.
3. Execute o protótipo conforme o README.
4. Faça alterações focadas no problema proposto, preservando a identidade e as convenções do projeto.
5. Verifique os cenários relevantes de [docs/TESTES.md](docs/TESTES.md).
6. Atualize a documentação se o comportamento mudar.
7. Envie um pull request com a motivação, as alterações e as verificações realizadas.

## Convenções

- Use HTML semântico e mantenha os rótulos dos formulários.
- Preserve o suporte a telas menores e à navegação por teclado.
- Evite novas dependências para mudanças simples.
- Use dados fictícios nos exemplos e não inclua credenciais.
- Explique mudanças nas regras de negociação e no modelo de dados.
- Ao alterar o código extraído, trate `src/` como a versão de trabalho. O ZIP em `AgroEncomenda/` é uma cópia histórica e não é atualizado automaticamente.

## Checklist do pull request

- [ ] A mudança está descrita de forma clara.
- [ ] Os fluxos afetados foram verificados.
- [ ] Não surgiram erros no console nos cenários verificados.
- [ ] A interface foi conferida em tela ampla e estreita, quando aplicável.
- [ ] A documentação corresponde ao comportamento entregue.
