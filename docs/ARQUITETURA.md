# Arquitetura e modelo de dados

## Implementação atual

O protótipo utiliza um único documento HTML com várias seções. A função `navegarPara` alterna sua visibilidade e chama as rotinas de renderização correspondentes. Não há roteamento por servidor nem URLs independentes para cada tela.

| Arquivo | Responsabilidade |
| --- | --- |
| `src/index.html` | Estrutura das telas, formulários, navegação, modal e área de avisos. |
| `src/style.css` | Cores, tipografia, componentes, grades e regras responsivas. |
| `src/script.js` | Dados de exemplo, estado, eventos, validações e respostas simuladas. |

## Estado em memória

| Identificador | Papel |
| --- | --- |
| `produtos`, `produtores`, `encomendas` | Catálogos e demanda demonstrativa pré-carregados. |
| `usuarioAtual` | Identidade temporária exibida na interface. |
| `precosLojaVisiveis` | Alternância da visualização de preços. |
| `produtoSelecionado`, `encomendaSelecionada`, `produtorSelecionado` | Contexto da tela aberta. |
| `minhasPropostas`, `minhasPerguntas` | Interações realizadas enquanto a página permanece carregada. |
| `perguntaContexto` | Produtor, produto e origem da pergunta em edição. |

Recarregar a página recria o estado inicial. Sair da conta limpa usuário, propostas e perguntas, mas não recria todos os dados globais; por exemplo, o contador da encomenda pode continuar alterado até a recarga.

## Regras de simulação

- O pedido de produto valida quantidade mínima, limite da quantidade disponível, valor positivo e presença da data. O formulário também define uma data mínima para o dia seguinte.
- A proposta de produto é aceita se o valor unitário atingir pelo menos 85% do preço usado como referência, seja varejo ou atacado.
- A simulação aceita passa por `Aceita` aos 4 segundos, `Pagamento combinado` aos 8, `A caminho` aos 12 e `Entregue` aos 16.
- A recusa ocorre após 5 segundos quando a oferta fica abaixo do limite.
- A proposta para a encomenda pré-carregada incrementa seu contador e segue o fluxo de aceitação automática.
- A pergunta exige pelo menos cinco caracteres e recebe resposta predefinida após 6 segundos.

Esses tempos são atrasos programados com `setTimeout`; a execução pode variar conforme o navegador. Não representam processamento remoto.

## Modelo relacional proposto

Os PDFs documentam as seguintes entidades para uma implementação futura:

| Entidade | Função | Referências principais |
| --- | --- | --- |
| Usuario | Cadastro e perfil | Sem chave estrangeira principal no modelo apresentado. |
| Vitrine | Apresentação e logística do produtor | `usuario_id` → Usuario. |
| Categoria | Classificação e safra | Referenciada por Produto e Encomenda. |
| Produto | Item ofertado | `vitrine_id` → Vitrine; `categoria_id` → Categoria. |
| Encomenda | Demanda do comprador | `comprador_id` → Usuario; `categoria_id` → Categoria. |
| Proposta | Oferta para atender uma encomenda | `encomenda_id` → Encomenda; `vendedor_id` → Usuario. |
| Mensagem | Comunicação entre usuários | Remetente e destinatário → Usuario; `produto_id` → Produto. |

Todas apresentam `id` como chave primária nos documentos. A normalização descrita separa usuários e categorias para reduzir repetição e dependências entre atributos não-chave. Não há definição de SGBD, migrações ou esquema SQL executável no material analisado.

## Pontos a conciliar antes de implementar o banco

1. **Vitrine no dicionário:** o resumo de atributos repete campos de usuário. Os demais documentos descrevem `usuario_id`, apresentação e opções de atendimento. É necessário definir uma versão canônica.
2. **Nomenclatura:** aparecem variações como `preco_oferecido`/`preco_unit`, `quantidade`/`qtd_oferecida` e `prazo`/`prazo_limite`. Escolher nomes únicos para API e banco.
3. **Compra direta:** o modelo Proposta dos PDFs referencia uma encomenda, mas a interface também cria propostas diretamente para produtos. O modelo precisa representar os dois fluxos sem confundi-los.
4. **Estados:** os PDFs descrevem principalmente pendente, aceita e recusada; o protótipo acrescenta pagamento combinado, a caminho e entregue. Definir se são estados de proposta, pedido ou entrega.
5. **Campos não persistidos:** observações do pedido e mensagem da oferta de encomenda aparecem nos formulários, mas não são guardadas no objeto criado pelo JavaScript.
6. **Identificação:** alguns vínculos do protótipo usam nomes de produtores. Uma implementação persistente deve estabelecer relações por identificadores.

Consulte os [documentos do projeto](../README.md#documentação) para comparar o modelo completo.

## Organização do projeto

O código HTML, CSS e JavaScript fica disponível diretamente em `src/`. Os diagramas e PDFs estão em `AgroEncomenda/`, e os guias técnicos em `docs/`. Este repositório centraliza o desenvolvimento e a documentação da equipe. O roteiro de testes descreve verificações a executar; não equivale a uma homologação funcional em navegador.
